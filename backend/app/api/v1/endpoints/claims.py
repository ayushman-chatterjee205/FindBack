import uuid
import secrets
import hashlib
import json
from datetime import datetime, timedelta, timezone
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import get_db
from app.core.security import get_current_user, get_current_staff
from app.models.user import User
from app.models.match import MatchCandidate
from app.models.claim import ClaimRecord
from app.models.item import LostItem, FoundItem
from app.models.audit_log import AuditLog
from app.models.notification import Notification
from app.schemas.claim import (
    ClaimCreate,
    ClaimReview,
    ClaimResponse,
    PendingClaimResponse,
    PickupPassResponse,
    HandoverVerifyRequest,
    HandoverVerifyResponse,
)

router = APIRouter()

@router.post("", response_model=ClaimResponse, status_code=status.HTTP_201_CREATED)
async def submit_ownership_claim(
    claim_in: ClaimCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Student submits ownership challenge answering secret distinguishing marks."""
    match = None

    # Fallback: if match_id was passed, check if it's actually a found_item_id
    if claim_in.match_id and not claim_in.found_item_id:
        f_check = await db.execute(select(FoundItem).where(FoundItem.id == claim_in.match_id))
        if f_check.scalar_one_or_none():
            claim_in.found_item_id = claim_in.match_id
            claim_in.match_id = None

    if claim_in.match_id:
        match_stmt = select(MatchCandidate).where(MatchCandidate.id == claim_in.match_id)
        match_res = await db.execute(match_stmt)
        match = match_res.scalar_one_or_none()
        if not match:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Match record not found")

    elif claim_in.found_item_id:
        # Check that found item exists
        f_stmt = select(FoundItem).where(FoundItem.id == claim_in.found_item_id)
        f_res = await db.execute(f_stmt)
        found_item = f_res.scalar_one_or_none()
        if not found_item:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Found item not found in custody")

        # Check if match already exists
        match_stmt = (
            select(MatchCandidate)
            .join(LostItem, MatchCandidate.lost_item_id == LostItem.id)
            .where(LostItem.user_id == current_user.id, MatchCandidate.found_item_id == claim_in.found_item_id)
            .order_by(LostItem.created_at.desc())
        )
        m_res = await db.execute(match_stmt)
        match = m_res.scalars().first()

        if not match:
            # Check if user has an active lost report
            l_stmt = select(LostItem).where(LostItem.user_id == current_user.id).order_by(LostItem.created_at.desc())
            l_res = await db.execute(l_stmt)
            lost_item = l_res.scalars().first()

            if not lost_item:
                # Auto-generate lost report representing this claim
                lost_item = LostItem(
                    id=str(uuid.uuid4()),
                    user_id=current_user.id,
                    title=f"Claim: {found_item.title}",
                    category=found_item.category,
                    location_name=found_item.location_name,
                    description=claim_in.proof_description,
                    lost_timestamp=found_item.found_timestamp,
                    status="MATCHED"
                )
                db.add(lost_item)
                await db.flush()

            match = MatchCandidate(
                id=str(uuid.uuid4()),
                lost_item_id=lost_item.id,
                found_item_id=found_item.id,
                composite_score=95.0,
                match_status="CLAIMED"
            )
            db.add(match)
            await db.flush()
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Either match_id or found_item_id must be provided")

    # Check if a claim already exists for this match from this student
    existing_stmt = select(ClaimRecord).where(
        ClaimRecord.match_id == match.id,
        ClaimRecord.student_id == current_user.id
    )
    existing_res = await db.execute(existing_stmt)
    existing_claim = existing_res.scalars().first()
    if existing_claim:
        # Return already-existing active claim record instead of creating duplicate
        return existing_claim

    # Update match status to indicate claimed
    match.match_status = "CLAIMED"

    new_claim_id = str(uuid.uuid4())
    claim = ClaimRecord(
        id=new_claim_id,
        match_id=match.id,
        student_id=current_user.id,
        proof_description=claim_in.proof_description,
        proof_image_url=claim_in.proof_image_url,
        status="PENDING",
    )
    db.add(claim)

    # In-app notification for the student
    notif = Notification(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        title="Ownership Claim Submitted 📋",
        message="Your claim has been submitted. Campus security will review your proof of ownership at the Central Block Vault.",
        link_url="/my-reports",
        type="claim"
    )
    db.add(notif)

    # Log audit entry
    audit = AuditLog(
        id=str(uuid.uuid4()),
        entity_type="claim",
        entity_id=new_claim_id,
        action="CHALLENGE_SUBMITTED",
        performed_by_id=current_user.id,
        metadata_json=json.dumps({"student_email": current_user.email, "match_id": match.id})
    )
    db.add(audit)

    await db.commit()
    await db.refresh(claim)
    return claim

@router.get("/pending", response_model=List[PendingClaimResponse])
async def list_pending_claims(
    current_staff: User = Depends(get_current_staff),
    db: AsyncSession = Depends(get_db)
):
    """Staff review console: retrieve all pending ownership claims."""
    stmt = select(ClaimRecord).where(ClaimRecord.status == "PENDING").order_by(ClaimRecord.created_at.desc())
    res = await db.execute(stmt)
    claims = res.scalars().all()

    results = []
    for c in claims:
        m_res = await db.execute(select(MatchCandidate).where(MatchCandidate.id == c.match_id))
        m = m_res.scalar_one_or_none()
        if not m:
            continue
        f_res = await db.execute(select(FoundItem).where(FoundItem.id == m.found_item_id))
        f_item = f_res.scalar_one_or_none()

        u_res = await db.execute(select(User).where(User.id == c.student_id))
        student = u_res.scalar_one_or_none()

        results.append(
            PendingClaimResponse(
                id=c.id,
                itemTitle=f_item.title if f_item else "Custody Item",
                storageBin=f_item.storage_locker_bin if f_item and f_item.storage_locker_bin else "Campus Custody Desk",
                studentName=student.full_name if student else "Campus Member",
                studentRoll=student.roll_number if student and student.roll_number else "N/A",
                studentEmail=student.email if student else "N/A",
                studentProof=c.proof_description,
                secretActualAttribute=f_item.secret_details if f_item and f_item.secret_details else "Physical custody inspection item",
                submittedTime=c.created_at.isoformat(),
            )
        )
    return results

@router.get("/approved", response_model=List[PendingClaimResponse])
async def list_approved_claims(
    current_staff: User = Depends(get_current_staff),
    db: AsyncSession = Depends(get_db)
):
    """Staff handover console: retrieve all approved claims awaiting student collection."""
    stmt = select(ClaimRecord).where(ClaimRecord.status == "APPROVED").order_by(ClaimRecord.created_at.desc())
    res = await db.execute(stmt)
    claims = res.scalars().all()

    results = []
    for c in claims:
        m_res = await db.execute(select(MatchCandidate).where(MatchCandidate.id == c.match_id))
        m = m_res.scalar_one_or_none()
        if not m:
            continue
        f_res = await db.execute(select(FoundItem).where(FoundItem.id == m.found_item_id))
        f_item = f_res.scalar_one_or_none()

        u_res = await db.execute(select(User).where(User.id == c.student_id))
        student = u_res.scalar_one_or_none()

        results.append(
            PendingClaimResponse(
                id=c.id,
                itemTitle=f_item.title if f_item else "Custody Item",
                storageBin=f_item.storage_locker_bin if f_item and f_item.storage_locker_bin else "Campus Custody Desk",
                studentName=student.full_name if student else "Campus Member",
                studentRoll=student.roll_number if student and student.roll_number else "N/A",
                studentEmail=student.email if student else "N/A",
                studentProof=c.proof_description,
                secretActualAttribute=f_item.secret_details if f_item and f_item.secret_details else "Physical custody inspection item",
                submittedTime=c.created_at.isoformat(),
            )
        )
    return results

@router.get("/my", response_model=List[ClaimResponse])
async def list_my_claims(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve all claims submitted by the logged-in user."""
    stmt = select(ClaimRecord).where(ClaimRecord.student_id == current_user.id).order_by(ClaimRecord.created_at.desc())
    res = await db.execute(stmt)
    claims = res.scalars().all()

    results = []
    for c in claims:
        item_title = "Custody Item"
        storage_bin = "Campus Custody Desk"
        if c.match_id:
            m_res = await db.execute(select(MatchCandidate).where(MatchCandidate.id == c.match_id))
            m = m_res.scalar_one_or_none()
            if m:
                f_res = await db.execute(select(FoundItem).where(FoundItem.id == m.found_item_id))
                f_item = f_res.scalar_one_or_none()
                if f_item:
                    item_title = f_item.title
                    storage_bin = f_item.storage_locker_bin or "Campus Custody Desk"
        
        resp = ClaimResponse.model_validate(c)
        resp.item_title = item_title
        resp.storage_bin = storage_bin
        results.append(resp)
    return results

@router.patch("/{claim_id}/review", response_model=ClaimResponse)
@router.post("/{claim_id}/review", response_model=ClaimResponse)
async def review_ownership_claim(
    claim_id: str,
    review_in: ClaimReview,
    current_staff: User = Depends(get_current_staff),
    db: AsyncSession = Depends(get_db)
):
    """Security officer reviews and approves or rejects student's challenge proof."""
    claim_stmt = select(ClaimRecord).where(ClaimRecord.id == claim_id)
    claim_res = await db.execute(claim_stmt)
    claim = claim_res.scalar_one_or_none()

    if not claim:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Claim record not found")

    status_val = (review_in.status or review_in.action or "APPROVED").upper()
    if status_val == "APPROVE":
        status_val = "APPROVED"
    elif status_val == "REJECT":
        status_val = "REJECTED"

    claim.status = status_val
    claim.reviewed_by_id = current_staff.id

    # If approved, update item/match status and notify student
    if status_val == "APPROVED":
        if claim.match_id:
            m_res = await db.execute(select(MatchCandidate).where(MatchCandidate.id == claim.match_id))
            match = m_res.scalar_one_or_none()
            if match:
                match.match_status = "VERIFIED"
                l_res = await db.execute(select(LostItem).where(LostItem.id == match.lost_item_id))
                lost_item = l_res.scalar_one_or_none()
                if lost_item:
                    lost_item.status = "VERIFIED"

        notif = Notification(
            id=str(uuid.uuid4()),
            user_id=claim.student_id,
            title="Ownership Claim Approved! 🎉",
            message="Your ownership proof was verified. Generate your digital pickup pass to collect your item.",
            link_url="/my-reports",
            type="claim"
        )
        db.add(notif)
    elif status_val == "REJECTED":
        notif = Notification(
            id=str(uuid.uuid4()),
            user_id=claim.student_id,
            title="Ownership Claim Update",
            message="Your ownership claim was reviewed by campus security but could not be verified with the provided details.",
            link_url="/my-reports",
            type="claim"
        )
        db.add(notif)

    # Log audit trail
    audit = AuditLog(
        id=str(uuid.uuid4()),
        entity_type="claim",
        entity_id=claim.id,
        action=f"CLAIM_{review_in.status}",
        performed_by_id=current_staff.id,
        metadata_json=json.dumps({"reviewed_by": current_staff.full_name, "decision": review_in.status})
    )
    db.add(audit)

    await db.commit()
    await db.refresh(claim)
    return claim

@router.post("/{claim_id}/generate-pass", response_model=PickupPassResponse)
async def generate_pickup_pass(
    claim_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Generates single-use dynamic OTP and cryptographic pickup QR token
    for an approved claim. Supports resolution by claim ID, match ID, or lost item ID.
    """
    claim = None
    # 1. Search directly by ClaimRecord ID
    claim_stmt = select(ClaimRecord).where(ClaimRecord.id == claim_id)
    claim_res = await db.execute(claim_stmt)
    claim = claim_res.scalars().first()

    # 2. Search by MatchCandidate ID
    if not claim:
        m_claim_stmt = select(ClaimRecord).where(ClaimRecord.match_id == claim_id).order_by(ClaimRecord.created_at.desc())
        m_claim_res = await db.execute(m_claim_stmt)
        for cc in m_claim_res.scalars().all():
            if cc.student_id == current_user.id or current_user.role in ["staff", "admin"]:
                claim = cc
                break

    # 3. Search by LostItem or FoundItem ID
    if not claim:
        lm_stmt = select(MatchCandidate).where(
            (MatchCandidate.lost_item_id == claim_id) | (MatchCandidate.found_item_id == claim_id)
        )
        lm_res = await db.execute(lm_stmt)
        candidates = lm_res.scalars().all()
        for cand in candidates:
            c_res = await db.execute(
                select(ClaimRecord)
                .where(ClaimRecord.match_id == cand.id)
                .order_by(ClaimRecord.created_at.desc())
            )
            for cc in c_res.scalars().all():
                if cc.student_id == current_user.id or current_user.role in ["staff", "admin"]:
                    claim = cc
                    break
            if claim:
                break

    if not claim:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Claim record not found")

    if claim.student_id != current_user.id and current_user.role not in ["staff", "admin"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    if claim.status == "COMPLETED":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="This item has already been collected.")

    if claim.status != "APPROVED":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Claim has not been approved yet")

    # Generate or reuse 6-digit numeric OTP and QR token using cryptographically secure PRNG
    otp = claim.handover_otp if claim.handover_otp else f"{secrets.randbelow(900000) + 100000}"
    qr_token = claim.handover_qr_token if claim.handover_qr_token else f"FB-PICKUP-{uuid.uuid4().hex[:12].upper()}"

    # Store both plain OTP (for instant match) and hash
    claim.handover_otp = otp
    claim.handover_otp_hash = hashlib.sha256(otp.encode()).hexdigest()
    claim.handover_qr_token = qr_token
    claim.expires_at = datetime.now(timezone.utc) + timedelta(minutes=60)

    # Safely resolve locker bin without throwing exceptions
    storage_bin = "Campus Custody Desk"
    if claim.match_id:
        m_res = await db.execute(select(MatchCandidate).where(MatchCandidate.id == claim.match_id))
        match = m_res.scalar_one_or_none()
        if match and match.found_item_id:
            f_res = await db.execute(select(FoundItem).where(FoundItem.id == match.found_item_id))
            found_item = f_res.scalar_one_or_none()
            if found_item and found_item.storage_locker_bin:
                storage_bin = found_item.storage_locker_bin

    await db.commit()

    return PickupPassResponse(
        claim_id=claim.id,
        handover_otp=otp,
        otp=otp,
        handover_qr_token=qr_token,
        storage_bin=storage_bin,
        expires_in_seconds=3600,
    )

@router.post("/handover-verify", response_model=HandoverVerifyResponse)
@router.post("/verify-handover", response_model=HandoverVerifyResponse)
async def verify_handover_at_desk(
    payload: HandoverVerifyRequest,
    current_staff: User = Depends(get_current_staff),
    db: AsyncSession = Depends(get_db)
):
    """
    Security officer scans student QR or enters 6-digit OTP at custody desk.
    - Validates token/OTP.
    - Updates item status to RETURNED.
    - Writes permanent institutional audit trail entry.
    """
    claim = None
    pin_clean = payload.handover_otp.strip() if payload.handover_otp else None
    if pin_clean and (len(pin_clean) != 6 or not pin_clean.isdigit()):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Handover PIN must be exactly 6 digits."
        )
    pin_hash = hashlib.sha256(pin_clean.encode()).hexdigest() if pin_clean else None

    # 1. Match by QR token
    if payload.handover_qr_token:
        stmt = select(ClaimRecord).where(ClaimRecord.handover_qr_token == payload.handover_qr_token.strip())
        res = await db.execute(stmt)
        claim = res.scalar_one_or_none()

    # 2. Match by specific claim_id + PIN
    elif payload.claim_id and pin_clean:
        stmt = select(ClaimRecord).where(ClaimRecord.id == payload.claim_id)
        res = await db.execute(stmt)
        c = res.scalar_one_or_none()
        if c:
            if c.handover_otp == pin_clean or c.handover_otp_hash == pin_hash:
                claim = c
            else:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid 6-digit PIN for this claim.")

    # 3. Match by PIN alone across approved claims
    elif pin_clean:
        stmt = select(ClaimRecord).where(
            ((ClaimRecord.handover_otp == pin_clean) | (ClaimRecord.handover_otp_hash == pin_hash)) &
            (ClaimRecord.status == "APPROVED")
        )
        res = await db.execute(stmt)
        claim = res.scalar_one_or_none()

    # 4. If not found in approved, check if already completed
    if not claim and pin_clean:
        done_stmt = select(ClaimRecord).where(
            ((ClaimRecord.handover_otp == pin_clean) | (ClaimRecord.handover_otp_hash == pin_hash)) &
            (ClaimRecord.status == "COMPLETED")
        )
        done_res = await db.execute(done_stmt)
        if done_res.scalar_one_or_none():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="This item has already been marked as returned to the owner.")

    if not claim:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid 6-digit PIN. Please ask the student to display their active digital pickup pass."
        )

    # Check expiration if set
    if claim.expires_at:
        now_utc = datetime.now(timezone.utc)
        claim_exp = claim.expires_at if claim.expires_at.tzinfo else claim.expires_at.replace(tzinfo=timezone.utc)
        if now_utc > claim_exp:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Pickup pass has expired. Student must re-generate.")

    # Mark claim completed
    claim.status = "COMPLETED"

    # Safely update related item statuses
    item_title = "Verified Custody Item"
    storage_bin = "Campus Custody Desk"

    if claim.match_id:
        match_stmt = select(MatchCandidate).where(MatchCandidate.id == claim.match_id)
        match_res = await db.execute(match_stmt)
        match = match_res.scalar_one_or_none()
        if match:
            match.match_status = "RETURNED"
            if match.lost_item_id:
                lost_stmt = select(LostItem).where(LostItem.id == match.lost_item_id)
                lost_res = await db.execute(lost_stmt)
                lost_item = lost_res.scalar_one_or_none()
                if lost_item:
                    lost_item.status = "RETURNED"
            if match.found_item_id:
                found_stmt = select(FoundItem).where(FoundItem.id == match.found_item_id)
                found_res = await db.execute(found_stmt)
                found_item = found_res.scalar_one_or_none()
                if found_item:
                    found_item.status = "RETURNED"
                    item_title = found_item.title
                    if found_item.storage_locker_bin:
                        storage_bin = found_item.storage_locker_bin

    # Fetch student info
    u_stmt = select(User).where(User.id == claim.student_id)
    u_res = await db.execute(u_stmt)
    student = u_res.scalar_one_or_none()
    student_name = student.full_name if student else "Campus Member"
    student_roll = student.roll_number if student and student.roll_number else "N/A"

    # Write permanent audit log
    audit = AuditLog(
        id=str(uuid.uuid4()),
        entity_type="custody",
        entity_id=claim.id,
        action="HANDOVER_VERIFIED",
        performed_by_id=current_staff.id,
        metadata_json=json.dumps({
            "student_id": claim.student_id,
            "officer_name": current_staff.full_name,
            "item_title": item_title,
            "storage_bin": storage_bin
        })
    )
    db.add(audit)

    # Congratulatory notification to student
    notif = Notification(
        id=str(uuid.uuid4()),
        user_id=claim.student_id,
        title="Item Return Confirmed! 🎉",
        message=f"Your '{item_title}' has been successfully returned at {storage_bin}. Thank you for using FindBack Campus!",
        link_url="/my-reports",
        type="claim"
    )
    db.add(notif)

    await db.commit()

    return HandoverVerifyResponse(
        success=True,
        status="COMPLETED",
        message=f"Item '{item_title}' successfully handed over to {student_name} ({student_roll}).",
        item_title=item_title,
        claim_id=claim.id,
        returned_timestamp=datetime.now(timezone.utc),
        student_name=student_name,
        student_roll=student_roll,
        storage_bin=storage_bin,
        handed_over_by=current_staff.full_name,
    )
