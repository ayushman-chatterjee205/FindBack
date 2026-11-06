from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class AuditLogResponse(BaseModel):
    id: str
    entity_type: str
    entity_id: str
    action: str
    performed_by_id: Optional[str] = None
    client_ip: Optional[str] = None
    metadata_json: Optional[str] = None
    timestamp: datetime

    class Config:
        from_attributes = True
