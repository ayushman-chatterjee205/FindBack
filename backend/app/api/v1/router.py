from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    lost_items,
    found_items,
    matches,
    claims,
    campus_zones,
    notifications,
    analytics,
    categories,
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(lost_items.router, prefix="/lost-items", tags=["Lost Items"])
api_router.include_router(found_items.router, prefix="/found-items", tags=["Found Items & Custody"])
api_router.include_router(categories.router, prefix="/categories", tags=["Dynamic Categories"])
api_router.include_router(matches.router, prefix="/matches", tags=["AI Matching"])
api_router.include_router(claims.router, prefix="/claims", tags=["Claims & Handover"])
api_router.include_router(campus_zones.router, prefix="/campus-zones", tags=["Campus Topology"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["In-App Notifications"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Campus Recovery Analytics"])
