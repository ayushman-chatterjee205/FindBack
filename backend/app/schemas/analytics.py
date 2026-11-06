from typing import List, Dict, Any
from pydantic import BaseModel

class CampusHotspotStat(BaseModel):
    zone_name: str
    building: str
    reports_count: int

class CampusKPIsResponse(BaseModel):
    total_lost_reported: int
    total_found_in_custody: int
    total_reconnected: int
    recovery_rate_percentage: float
    average_days_in_custody: float
    hotspots: List[CampusHotspotStat]
