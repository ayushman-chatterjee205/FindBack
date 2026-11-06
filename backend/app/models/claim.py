import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from app.db.base import Base

class ClaimRecord(Base):
    __tablename__ = "claims"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    match_id = Column(String(36), ForeignKey("matches.id"), nullable=False, index=True)
    student_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    proof_description = Column(Text, nullable=False)  # Student's challenge answer
    proof_image_url = Column(String(500), nullable=True)
    status = Column(String(50), default="PENDING", nullable=False)  # PENDING | APPROVED | REJECTED | COMPLETED
    reviewed_by_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    handover_otp = Column(String(10), nullable=True)
    handover_otp_hash = Column(String(255), nullable=True)
    handover_qr_token = Column(String(255), nullable=True)
    expires_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
