import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class MatchCandidate(Base):
    __tablename__ = "matches"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    lost_item_id = Column(String(36), ForeignKey("lost_items.id"), nullable=False, index=True)
    found_item_id = Column(String(36), ForeignKey("found_items.id"), nullable=False, index=True)
    
    # 4 Sub-Scores (0.0 to 1.0)
    text_score = Column(Float, nullable=False, default=0.0)
    image_score = Column(Float, nullable=False, default=0.0)
    spatial_score = Column(Float, nullable=False, default=0.0)
    temporal_score = Column(Float, nullable=False, default=0.0)
    
    # Composite Score (0.0 to 100.0)
    composite_score = Column(Float, nullable=False, default=0.0)
    
    match_status = Column(String(50), default="SUGGESTED", nullable=False)  # SUGGESTED | NOTIFIED | REJECTED | VERIFIED
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
