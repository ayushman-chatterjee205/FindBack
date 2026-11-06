from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class ClaimCreate(BaseModel):
    match_id: Optional[str] = None
    found_item_id: Optional[str] = None
    proof_description: str
    proof_image_url: Optional[str] = None

class ClaimReview(BaseModel):
    status: Optional[str] = None
    action: Optional[str] = None
    review_notes: Optional[str] = None

class PendingClaimResponse(BaseModel):
    id: str
    itemTitle: str
    storageBin: str
    studentName: str
    studentRoll: str
    studentEmail: str
    studentProof: str
    secretActualAttribute: str
    submittedTime: str

class ClaimResponse(BaseModel):
    id: str
    match_id: str
    student_id: str
    proof_description: str
    proof_image_url: Optional[str] = None
    status: str
    item_title: Optional[str] = None
    storage_bin: Optional[str] = None
    reviewed_by_id: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class PickupPassResponse(BaseModel):
    claim_id: str
    handover_otp: str
    otp: Optional[str] = None
    handover_qr_token: str
    storage_bin: str
    expires_in_seconds: int

class HandoverVerifyRequest(BaseModel):
    claim_id: Optional[str] = None
    handover_otp: Optional[str] = None
    handover_qr_token: Optional[str] = None

class HandoverVerifyResponse(BaseModel):
    success: bool
    status: str = "COMPLETED"
    message: str
    item_title: str
    claim_id: str
    returned_timestamp: datetime
    student_name: Optional[str] = None
    student_roll: Optional[str] = None
    storage_bin: Optional[str] = None
    handed_over_by: Optional[str] = None
