import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from app.db.base import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    entity_type = Column(String(50), nullable=False, index=True)  # item | claim | custody
    entity_id = Column(String(36), nullable=False, index=True)
    action = Column(String(100), nullable=False)  # REGISTER | STATUS_CHANGE | HANDOVER_VERIFIED | CHALLENGE_SUBMITTED
    performed_by_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    client_ip = Column(String(50), nullable=True)
    metadata_json = Column(Text, nullable=True)
    timestamp = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
