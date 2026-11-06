from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class NotificationResponse(BaseModel):
    id: str
    user_id: str
    title: str
    message: str
    link_url: Optional[str] = None
    is_read: bool
    type: str
    created_at: datetime

    class Config:
        from_attributes = True
