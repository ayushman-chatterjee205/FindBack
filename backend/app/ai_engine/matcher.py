import uuid
from typing import List, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.config import settings
from app.models.item import LostItem, FoundItem
from app.models.match import MatchCandidate
from app.models.notification import Notification
from app.ai_engine.text_embedder import cosine_similarity
from app.ai_engine.image_embedder import compute_visual_similarity
from app.ai_engine.spatial import compute_spatial_similarity
from app.ai_engine.temporal import compute_temporal_similarity

def calculate_composite_score(
    s_text: float,
    s_image: float,
    s_spatial: float,
    s_temporal: float
) -> float:
    """Computes weighted composite score (0 to 100)."""
    weighted_sum = (
        (settings.WEIGHT_TEXT * s_text) +
        (settings.WEIGHT_IMAGE * s_image) +
        (settings.WEIGHT_SPATIAL * s_spatial) +
        (settings.WEIGHT_TEMPORAL * s_temporal)
    )
    return round(max(0.0, min(100.0, weighted_sum * 100.0)), 1)

async def scan_and_match_lost_item(db: AsyncSession, lost_item: LostItem) -> List[MatchCandidate]:
    """Sweeps custody items against newly reported lost item."""
    stmt = select(FoundItem).where(FoundItem.status != "RETURNED")
    result = await db.execute(stmt)
    found_items = result.scalars().all()

    created_matches = []
    for found in found_items:
        # 1. Text Similarity
        s_text = 0.0
        if lost_item.text_embedding and found.text_embedding:
            s_text = cosine_similarity(lost_item.text_embedding, found.text_embedding)
        else:
            # Fallback simple title/category comparison
            s_text = 0.8 if lost_item.category == found.category else 0.2

        # 2. Image Similarity
        s_image = compute_visual_similarity(getattr(lost_item, 'image_embedding', None), getattr(found, 'image_embedding', None))

        # 3. Spatial Hierarchy
        s_spatial = compute_spatial_similarity(lost_item.location_name, found.location_name)

        # 4. Temporal Decay
        s_temporal = compute_temporal_similarity(lost_item.lost_timestamp, found.found_timestamp)

        composite = calculate_composite_score(s_text, s_image, s_spatial, s_temporal)

        # If score is significant, create or update match record
        if composite >= 35.0:
            match = MatchCandidate(
                id=str(uuid.uuid4()),
                lost_item_id=lost_item.id,
                found_item_id=found.id,
                text_score=round(s_text, 3),
                image_score=round(s_image, 3),
                spatial_score=round(s_spatial, 3),
                temporal_score=round(s_temporal, 3),
                composite_score=composite,
                match_status="NOTIFIED" if composite >= settings.MATCH_NOTIFICATION_THRESHOLD else "SUGGESTED",
            )
            db.add(match)
            created_matches.append(match)

            # Trigger in-app notification if threshold reached
            if composite >= settings.MATCH_NOTIFICATION_THRESHOLD:
                notif = Notification(
                    id=str(uuid.uuid4()),
                    user_id=lost_item.user_id,
                    title="Potential Match Found!",
                    message=f"A {found.title} matching your '{lost_item.title}' was turned into custody ({composite}% match).",
                    link_url=f"/my-reports",
                    type="match"
                )
                db.add(notif)

    await db.commit()
    return created_matches

async def scan_and_match_found_item(db: AsyncSession, found_item: FoundItem) -> List[MatchCandidate]:
    """Sweeps active lost reports when staff registers a found item."""
    stmt = select(LostItem).where(LostItem.status == "LOST")
    result = await db.execute(stmt)
    lost_items = result.scalars().all()

    created_matches = []
    for lost in lost_items:
        s_text = cosine_similarity(lost.text_embedding, found_item.text_embedding) if (lost.text_embedding and found_item.text_embedding) else 0.5
        s_image = compute_visual_similarity(getattr(lost, 'image_embedding', None), getattr(found_item, 'image_embedding', None))
        s_spatial = compute_spatial_similarity(lost.location_name, found_item.location_name)
        s_temporal = compute_temporal_similarity(lost.lost_timestamp, found_item.found_timestamp)
        composite = calculate_composite_score(s_text, s_image, s_spatial, s_temporal)

        if composite >= 35.0:
            match = MatchCandidate(
                id=str(uuid.uuid4()),
                lost_item_id=lost.id,
                found_item_id=found_item.id,
                text_score=round(s_text, 3),
                image_score=round(s_image, 3),
                spatial_score=round(s_spatial, 3),
                temporal_score=round(s_temporal, 3),
                composite_score=composite,
                match_status="NOTIFIED" if composite >= settings.MATCH_NOTIFICATION_THRESHOLD else "SUGGESTED",
            )
            db.add(match)
            created_matches.append(match)

            if composite >= settings.MATCH_NOTIFICATION_THRESHOLD:
                notif = Notification(
                    id=str(uuid.uuid4()),
                    user_id=lost.user_id,
                    title="Potential Match Found!",
                    message=f"An item matching your '{lost.title}' was turned in at {found_item.location_name or 'Campus Custody'}.",
                    link_url=f"/my-reports",
                    type="match"
                )
                db.add(notif)

    await db.commit()
    return created_matches
