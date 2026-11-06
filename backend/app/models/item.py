import uuid
import json
from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy import Column, String, Text, Integer, DateTime, ForeignKey
from app.db.base import Base

class LostItem(Base):
    __tablename__ = "lost_items"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False, index=True)
    brand = Column(String(100), nullable=True)
    color = Column(String(50), nullable=True)
    description = Column(Text, nullable=False)
    secret_details = Column(Text, nullable=True)  # Distinguishing marks kept confidential
    location_id = Column(Integer, ForeignKey("campus_zones.id"), nullable=True)
    location_name = Column(String(255), nullable=True)
    lost_timestamp = Column(DateTime(timezone=True), nullable=False)
    status = Column(String(50), default="LOST", nullable=False, index=True)  # LOST | MATCHED | VERIFIED | RETURNED
    image_url = Column(String(500), nullable=True)
    text_embedding_json = Column(Text, nullable=True)  # 384-dim JSON array
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    @property
    def text_embedding(self) -> Optional[List[float]]:
        if self.text_embedding_json:
            try:
                return json.loads(self.text_embedding_json)
            except Exception:
                return None
        return None

    @text_embedding.setter
    def text_embedding(self, value: Optional[List[float]]):
        self.text_embedding_json = json.dumps(value) if value else None


class FoundItem(Base):
    __tablename__ = "found_items"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    reported_by_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False, index=True)
    storage_locker_bin = Column(String(100), nullable=True)  # Physical custody slot e.g. "Locker Bin B-04"
    location_id = Column(Integer, ForeignKey("campus_zones.id"), nullable=True)
    location_name = Column(String(255), nullable=True)
    found_timestamp = Column(DateTime(timezone=True), nullable=False)
    status = Column(String(50), default="IN_CUSTODY", nullable=False, index=True)  # IN_CUSTODY | MATCHED | VERIFIED | RETURNED
    primary_image_url = Column(String(500), nullable=True)
    description = Column(Text, nullable=False)
    secret_details = Column(Text, nullable=True)  # Masked private marks for zero-knowledge challenge
    text_embedding_json = Column(Text, nullable=True)   # 384-dim JSON array
    image_embedding_json = Column(Text, nullable=True)  # 512-dim JSON array
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    @property
    def text_embedding(self) -> Optional[List[float]]:
        if self.text_embedding_json:
            try:
                return json.loads(self.text_embedding_json)
            except Exception:
                return None
        return None

    @text_embedding.setter
    def text_embedding(self, value: Optional[List[float]]):
        self.text_embedding_json = json.dumps(value) if value else None

    @property
    def image_embedding(self) -> Optional[List[float]]:
        if self.image_embedding_json:
            try:
                return json.loads(self.image_embedding_json)
            except Exception:
                return None
        return None

    @image_embedding.setter
    def image_embedding(self, value: Optional[List[float]]):
        self.image_embedding_json = json.dumps(value) if value else None
