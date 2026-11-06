from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.item import LostItem, FoundItem
from app.models.match import MatchCandidate
from app.schemas.match import MatchCandidateResponse, MatchScoreBreakdown
from app.schemas.item import FoundItemPublicResponse, LostItemResponse

router = APIRouter()

@router.get("/lost/{lost_item_id}", response_model=List[MatchCandidateResponse])
async def get_matches_for_lost_item(
    lost_item_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve AI-evaluated candidate matches for a specific lost item."""
    # Verify ownership of report
    lost_stmt = select(LostItem).where(LostItem.id == lost_item_id)
    lost_res = await db.execute(lost_stmt)
    lost_item = lost_res.scalar_one_or_none()

    if not lost_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lost item report not found")

    if lost_item.user_id != current_user.id and current_user.role not in ["staff", "admin"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    stmt = (
        select(MatchCandidate)
        .where(MatchCandidate.lost_item_id == lost_item_id)
        .order_by(MatchCandidate.composite_score.desc())
    )
    result = await db.execute(stmt)
    matches = result.scalars().all()

    responses = []
    for m in matches:
        # Load related found item
        f_stmt = select(FoundItem).where(FoundItem.id == m.found_item_id)
        f_res = await db.execute(f_stmt)
        found_item = f_res.scalar_one_or_none()

        responses.append(
            MatchCandidateResponse(
                id=m.id,
                lost_item_id=m.lost_item_id,
                found_item_id=m.found_item_id,
                composite_score=m.composite_score,
                breakdown=MatchScoreBreakdown(
                    text_score=m.text_score,
                    image_score=m.image_score,
                    spatial_score=m.spatial_score,
                    temporal_score=m.temporal_score,
                ),
                match_status=m.match_status,
                created_at=m.created_at,
                found_item=FoundItemPublicResponse.model_validate(found_item) if found_item else None,
                lost_item=LostItemResponse.model_validate(lost_item),
            )
        )

    return responses

@router.get("/{match_id}", response_model=MatchCandidateResponse)
async def get_match_by_id(
    match_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve details for a specific match candidate."""
    stmt = select(MatchCandidate).where(MatchCandidate.id == match_id)
    res = await db.execute(stmt)
    m = res.scalar_one_or_none()

    if not m:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Match candidate not found")

    lost_stmt = select(LostItem).where(LostItem.id == m.lost_item_id)
    lost_res = await db.execute(lost_stmt)
    lost_item = lost_res.scalar_one_or_none()

    # Authorization Check: verify requesting student owns the lost report, or is staff/admin
    if lost_item and lost_item.user_id != current_user.id and current_user.role not in ["staff", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. You do not have permission to view matches for this item."
        )

    found_stmt = select(FoundItem).where(FoundItem.id == m.found_item_id)
    f_res = await db.execute(found_stmt)
    found_item = f_res.scalar_one_or_none()

    return MatchCandidateResponse(
        id=m.id,
        lost_item_id=m.lost_item_id,
        found_item_id=m.found_item_id,
        composite_score=m.composite_score,
        breakdown=MatchScoreBreakdown(
            text_score=m.text_score,
            image_score=m.image_score,
            spatial_score=m.spatial_score,
            temporal_score=m.temporal_score,
        ),
        match_status=m.match_status,
        created_at=m.created_at,
        found_item=FoundItemPublicResponse.model_validate(found_item) if found_item else None,
        lost_item=LostItemResponse.model_validate(lost_item) if lost_item else None,
    )
