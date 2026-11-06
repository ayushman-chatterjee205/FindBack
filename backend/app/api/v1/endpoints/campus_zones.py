from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import get_db
from app.models.campus import CampusZone
from pydantic import BaseModel

class CampusZoneResponse(BaseModel):
    id: int
    name: str
    building: str
    floor: str | None = None
    room_number: str | None = None

    class Config:
        from_attributes = True

router = APIRouter()

@router.get("", response_model=List[CampusZoneResponse])
async def list_campus_zones(db: AsyncSession = Depends(get_db)):
    """Returns list of campus buildings and location zones."""
    stmt = select(CampusZone).order_by(CampusZone.building, CampusZone.name)
    result = await db.execute(stmt)
    zones = result.scalars().all()
    return zones
