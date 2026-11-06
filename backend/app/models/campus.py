from sqlalchemy import Column, Integer, String, ForeignKey
from app.db.base import Base

class CampusZone(Base):
    __tablename__ = "campus_zones"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    building = Column(String(255), nullable=False, index=True)
    floor = Column(String(50), nullable=True)
    room_number = Column(String(50), nullable=True)
    parent_id = Column(Integer, ForeignKey("campus_zones.id"), nullable=True)
