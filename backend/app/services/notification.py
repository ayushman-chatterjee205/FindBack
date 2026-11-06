import uuid
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.notification import Notification

async def send_notification(
    db: AsyncSession,
    user_id: str,
    title: str,
    message: str,
    link_url: Optional[str] = None,
    notif_type: str = "match"
) -> Notification:
    """Creates persistent in-app notification for a user."""
    notif = Notification(
        id=str(uuid.uuid4()),
        user_id=user_id,
        title=title,
        message=message,
        link_url=link_url,
        type=notif_type,
        is_read=False,
    )
    db.add(notif)
    await db.commit()
    return notif
