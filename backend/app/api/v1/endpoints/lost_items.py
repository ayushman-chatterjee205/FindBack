import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.db.session import get_db
from app.core.security import get_current_user, get_optional_current_user
from app.models.user import User
from app.models.item import LostItem
from app.models.notification import Notification
from app.models.match import MatchCandidate
from app.schemas.item import LostItemCreate, LostItemResponse
from app.ai_engine.text_embedder import generate_text_embedding
from app.ai_engine.matcher import scan_and_match_lost_item

router = APIRouter()

@router.post("", response_model=LostItemResponse, status_code=status.HTTP_201_CREATED)
async def report_lost_item(
    item_in: LostItemCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Submit a lost item report.
    - Generates 384-dim semantic text embedding.
    - Automatically sweeps existing custody inventory for candidate matches.
    """
    lost_item = LostItem(
        user_id=current_user.id,
        title=item_in.title,
        category=item_in.category,
        brand=item_in.brand,
        color=item_in.color,
        description=item_in.description,
        secret_details=item_in.secret_details,
        location_id=item_in.location_id,
        location_name=item_in.location_name,
        lost_timestamp=item_in.lost_timestamp,
        image_url=item_in.image_url,
        status="LOST"
    )

    # Compute text embedding
    lost_item.text_embedding = generate_text_embedding(
        title=item_in.title,
        description=item_in.description,
        category=item_in.category,
        brand=item_in.brand or ""
    )

    db.add(lost_item)
    await db.commit()
    await db.refresh(lost_item)

    # Run AI matching sweep
    created_matches = await scan_and_match_lost_item(db, lost_item)

    # If no immediate high-scoring match was found, record registration notification
    if not created_matches:
        reg_notif = Notification(
            id=str(uuid.uuid4()),
            user_id=current_user.id,
            title="Lost Item Registered 📍",
            message=f"Your report for '{item_in.title}' is active. Our AI engine is scanning custody inventory across campus blocks.",
            link_url="/my-reports",
            type="info"
        )
        db.add(reg_notif)
        await db.commit()

    response = LostItemResponse.model_validate(lost_item)
    response.matches_count = len(created_matches)
    return response

@router.get("", response_model=List[LostItemResponse])
async def list_public_lost_items(
    category: str | None = None,
    search: str | None = None,
    db: AsyncSession = Depends(get_db)
):
    """
    Public catalog of reported lost items on campus.
    """
    stmt = select(LostItem).where(LostItem.status != "RETURNED")

    if category and category != "All":
        stmt = stmt.where(LostItem.category == category)

    if search:
        search_filter = f"%{search}%"
        stmt = stmt.where(LostItem.title.ilike(search_filter) | LostItem.description.ilike(search_filter))

    stmt = stmt.order_by(LostItem.lost_timestamp.desc())
    result = await db.execute(stmt)
    items = result.scalars().all()

    responses = []
    for item in items:
        resp = LostItemResponse.model_validate(item)
        resp.secret_details = None  # Mask secret details from public catalog
        responses.append(resp)

    return responses

@router.get("/my", response_model=List[LostItemResponse])
async def list_my_lost_reports(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve all lost reports filed by the logged-in student."""
    stmt = select(LostItem).where(LostItem.user_id == current_user.id).order_by(LostItem.created_at.desc())
    result = await db.execute(stmt)
    items = result.scalars().all()

    responses = []
    for item in items:
        # Count matches
        match_stmt = select(func.count(MatchCandidate.id)).where(MatchCandidate.lost_item_id == item.id)
        count_res = await db.execute(match_stmt)
        count = count_res.scalar() or 0
        
        resp = LostItemResponse.model_validate(item)
        resp.matches_count = count
        responses.append(resp)

    return responses

@router.get("/{id}", response_model=LostItemResponse)
async def get_lost_item(
    id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve a single lost report by ID."""
    stmt = select(LostItem).where(LostItem.id == id)
    result = await db.execute(stmt)
    item = result.scalar_one_or_none()

    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lost item report not found")

    # Only owner or staff can view
    if item.user_id != current_user.id and current_user.role not in ["staff", "admin"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    match_stmt = select(func.count(MatchCandidate.id)).where(MatchCandidate.lost_item_id == item.id)
    count_res = await db.execute(match_stmt)
    count = count_res.scalar() or 0

    resp = LostItemResponse.model_validate(item)
    resp.matches_count = count
    return resp
