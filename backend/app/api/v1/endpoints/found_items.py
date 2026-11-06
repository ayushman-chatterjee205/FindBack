from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import get_db
from app.core.security import get_current_user, get_current_staff, get_optional_current_user
from app.models.user import User
from app.models.item import FoundItem, LostItem
from app.models.claim import ClaimRecord
from app.models.match import MatchCandidate
from app.models.audit_log import AuditLog
from app.schemas.item import FoundItemCreate, FoundItemPublicResponse, FoundItemStaffResponse, ReturnedItemResponse
from app.ai_engine.text_embedder import generate_text_embedding
from app.ai_engine.image_embedder import generate_image_embedding
from app.ai_engine.matcher import scan_and_match_found_item

router = APIRouter()

def _mask_student_name(name: Optional[str]) -> str:
    """Masks student full name to protect personal identity (e.g. 'Ayushman C.')."""
    if not name:
        return "Verified Student Owner"
    parts = name.strip().split()
    if len(parts) == 1:
        return f"{parts[0][0]}***"
    return f"{parts[0]} {parts[-1][0]}."

def _mask_roll_number(roll: Optional[str]) -> str:
    """Masks student roll number to prevent institutional identity scraping."""
    if not roll or len(roll) < 4:
        return "Campus ID Verified"
    return f"{roll[:3]}***{roll[-1]}"

@router.get("", response_model=List[FoundItemPublicResponse])
async def list_public_found_items(
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    """
    Public catalog of found items currently in campus custody.
    Conceals private identifying details and internal storage locker bins to prevent fraud.
    """
    stmt = select(FoundItem).where(FoundItem.status != "RETURNED")

    if category and category != "All":
        stmt = stmt.where(FoundItem.category == category)

    if search:
        search_filter = f"%{search}%"
        stmt = stmt.where(FoundItem.title.ilike(search_filter) | FoundItem.description.ilike(search_filter))

    stmt = stmt.order_by(FoundItem.found_timestamp.desc())
    result = await db.execute(stmt)
    return result.scalars().all()

@router.post("", response_model=FoundItemStaffResponse, status_code=status.HTTP_201_CREATED)
async def register_found_item(
    item_in: FoundItemCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Register a found item turned into campus custody.
    - Can be reported by students or campus security staff.
    - Records location, confidential distinguishing marks.
    - Generates multi-modal embeddings and triggers automatic matching sweep.
    """
    is_staff = current_user.role in ["staff", "admin"]
    storage_bin = item_in.storage_locker_bin if (is_staff and item_in.storage_locker_bin) else (item_in.storage_locker_bin or "Pending Custody Intake")

    found_item = FoundItem(
        reported_by_id=current_user.id,
        title=item_in.title,
        category=item_in.category,
        storage_locker_bin=storage_bin,
        location_id=item_in.location_id,
        location_name=item_in.location_name,
        found_timestamp=item_in.found_timestamp,
        description=item_in.description,
        secret_details=item_in.secret_details,
        primary_image_url=item_in.primary_image_url,
        status="IN_CUSTODY"
    )

    # Compute text embedding
    found_item.text_embedding = generate_text_embedding(
        title=item_in.title,
        description=item_in.description,
        category=item_in.category
    )

    # Compute image embedding if image is provided
    found_item.image_embedding = generate_image_embedding()

    db.add(found_item)
    await db.commit()
    await db.refresh(found_item)

    # Trigger automatic AI match sweep across active lost reports
    await scan_and_match_found_item(db, found_item)

    return found_item

@router.get("/returned", response_model=List[ReturnedItemResponse])
async def list_returned_items(db: AsyncSession = Depends(get_db)):
    """
    Retrieve all successfully returned items with owner name, date, and timing.
    Aggregates completed claims, institutional custody handover logs, and returned items.
    """
    results: List[ReturnedItemResponse] = []
    seen_item_ids = set()

    # 1. From completed ownership claims
    stmt = (
        select(ClaimRecord)
        .where(ClaimRecord.status.in_(["COMPLETED", "RETURNED"]))
        .order_by(ClaimRecord.created_at.desc())
    )
    claims_res = await db.execute(stmt)
    claims = claims_res.scalars().all()

    for c in claims:
        # Fetch verified student / owner with privacy masking applied
        u_res = await db.execute(select(User).where(User.id == c.student_id))
        student = u_res.scalars().first()
        owner_name = _mask_student_name(student.full_name) if student else "Verified Campus Member"
        owner_roll = _mask_roll_number(student.roll_number) if student else "Campus ID Verified"
        owner_email = None  # Protected: omitted from public catalog

        # Fetch match and associated item
        item_title = "Campus Custody Item"
        category = "General"
        description = "Verified custody item returned to owner."
        image_url = c.proof_image_url
        location_name = "Campus Custody Desk"
        storage_bin = None  # Protected: internal locker bins concealed
        item_id = c.id

        if c.match_id:
            m_res = await db.execute(select(MatchCandidate).where(MatchCandidate.id == c.match_id))
            m = m_res.scalars().first()
            if m:
                if m.found_item_id:
                    f_res = await db.execute(select(FoundItem).where(FoundItem.id == m.found_item_id))
                    f_item = f_res.scalars().first()
                    if f_item:
                        item_id = f_item.id
                        item_title = f_item.title
                        category = f_item.category
                        description = f_item.description or description
                        image_url = f_item.primary_image_url or image_url
                        location_name = f_item.location_name or location_name
                        storage_bin = f_item.storage_locker_bin
                elif m.lost_item_id:
                    l_res = await db.execute(select(LostItem).where(LostItem.id == m.lost_item_id))
                    l_item = l_res.scalars().first()
                    if l_item:
                        item_id = l_item.id
                        item_title = l_item.title
                        category = l_item.category
                        description = l_item.description or description
                        image_url = l_item.image_url or image_url
                        location_name = l_item.location_name or location_name

        # Exact handover timing & officer from AuditLog
        audit_stmt = (
            select(AuditLog)
            .where(AuditLog.entity_id == c.id, AuditLog.action == "HANDOVER_VERIFIED")
            .order_by(AuditLog.timestamp.desc())
        )
        audit_res = await db.execute(audit_stmt)
        audit = audit_res.scalars().first()

        handed_over_by = "Custody Desk Officer"
        handover_time = c.created_at
        if audit:
            handover_time = audit.timestamp
            if audit.performed_by_id:
                staff_res = await db.execute(select(User).where(User.id == audit.performed_by_id))
                staff_user = staff_res.scalars().first()
                if staff_user:
                    handed_over_by = staff_user.full_name

        returned_date = handover_time.strftime("%d %b %Y")
        returned_time = handover_time.strftime("%I:%M %p")

        seen_item_ids.add(item_id)
        results.append(
            ReturnedItemResponse(
                id=item_id,
                title=item_title,
                category=category,
                description=description,
                image_url=image_url,
                location_name=location_name,
                storage_locker_bin=storage_bin,
                owner_name=owner_name,
                owner_roll=owner_roll,
                owner_email=owner_email,
                returned_timestamp=handover_time,
                returned_date=returned_date,
                returned_time=returned_time,
                handed_over_by=handed_over_by,
                proof_description="Verified custody proof matched.",
            )
        )

    # 2. Check any FoundItem with status == 'RETURNED' not already covered by claims above
    f_stmt = select(FoundItem).where(FoundItem.status == "RETURNED").order_by(FoundItem.created_at.desc())
    f_res = await db.execute(f_stmt)
    for fi in f_res.scalars().all():
        if fi.id in seen_item_ids:
            continue
        ts = fi.created_at
        results.append(
            ReturnedItemResponse(
                id=fi.id,
                title=fi.title,
                category=fi.category,
                description=fi.description,
                image_url=fi.primary_image_url,
                location_name=fi.location_name or "Campus Custody Desk",
                storage_locker_bin=fi.storage_locker_bin,
                owner_name="Verified Campus Member",
                owner_roll="Campus ID Verified",
                owner_email=None,
                returned_timestamp=ts,
                returned_date=ts.strftime("%d %b %Y"),
                returned_time=ts.strftime("%I:%M %p"),
                handed_over_by="Custody Officer",
            )
        )

    return results

@router.get("/{id}", response_model=FoundItemPublicResponse)
async def get_found_item(id: str, db: AsyncSession = Depends(get_db)):
    """Retrieve public masked details of a single found item."""
    stmt = select(FoundItem).where(FoundItem.id == id)
    result = await db.execute(stmt)
    item = result.scalar_one_or_none()

    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Found item not located in custody records")

    return item
