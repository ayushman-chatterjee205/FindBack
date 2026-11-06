from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel

class LostItemCreate(BaseModel):
    title: str
    category: str
    brand: Optional[str] = None
    color: Optional[str] = None
    description: str
    secret_details: Optional[str] = None
    location_id: Optional[int] = None
    location_name: Optional[str] = None
    lost_timestamp: datetime
    image_url: Optional[str] = None

class LostItemResponse(BaseModel):
    id: str
    user_id: str
    title: str
    category: str
    brand: Optional[str] = None
    color: Optional[str] = None
    description: str
    secret_details: Optional[str] = None
    location_id: Optional[int] = None
    location_name: Optional[str] = None
    lost_timestamp: datetime
    status: str
    image_url: Optional[str] = None
    created_at: datetime
    matches_count: Optional[int] = 0

    class Config:
        from_attributes = True

class FoundItemCreate(BaseModel):
    title: str
    category: str
    storage_locker_bin: Optional[str] = "Locker Bin A-01"
    location_id: Optional[int] = None
    location_name: Optional[str] = None
    found_timestamp: datetime
    description: str
    secret_details: Optional[str] = None
    primary_image_url: Optional[str] = None

class FoundItemPublicResponse(BaseModel):
    """Masked public view: secret_details and internal storage bin are concealed."""
    id: str
    title: str
    category: str
    location_id: Optional[int] = None
    location_name: Optional[str] = None
    found_timestamp: datetime
    status: str
    primary_image_url: Optional[str] = None
    description: str
    created_at: datetime

    class Config:
        from_attributes = True

FoundItemResponse = FoundItemPublicResponse

class FoundItemStaffResponse(BaseModel):
    """Full staff view with physical locker bin and challenge answers."""
    id: str
    reported_by_id: str
    title: str
    category: str
    storage_locker_bin: Optional[str] = None
    location_id: Optional[int] = None
    location_name: Optional[str] = None
    found_timestamp: datetime
    status: str
    primary_image_url: Optional[str] = None
    description: str
    secret_details: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class ReturnedItemResponse(BaseModel):
    id: str
    title: str
    category: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    location_name: Optional[str] = None
    storage_locker_bin: Optional[str] = None
    owner_name: str
    owner_roll: Optional[str] = None
    owner_email: Optional[str] = None
    returned_timestamp: datetime
    returned_date: str
    returned_time: str
    handed_over_by: Optional[str] = None
    proof_description: Optional[str] = None

    class Config:
        from_attributes = True
