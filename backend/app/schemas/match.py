from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from app.schemas.item import FoundItemPublicResponse, LostItemResponse

class MatchScoreBreakdown(BaseModel):
    text_score: float
    image_score: float
    spatial_score: float
    temporal_score: float

class MatchCandidateResponse(BaseModel):
    id: str
    lost_item_id: str
    found_item_id: str
    composite_score: float
    breakdown: MatchScoreBreakdown
    match_status: str
    created_at: datetime
    found_item: Optional[FoundItemPublicResponse] = None
    lost_item: Optional[LostItemResponse] = None

    class Config:
        from_attributes = True
