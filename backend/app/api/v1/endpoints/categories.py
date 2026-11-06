from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, distinct
from pydantic import BaseModel

from app.db.session import get_db
from app.models.item import LostItem, FoundItem

router = APIRouter()

DEFAULT_CATEGORIES = [
    "Electronics",
    "IDs & Cards",
    "Keys",
    "Bags & Wallets",
    "Accessories",
    "Books & Notes",
    "Clothing",
    "Other",
]

class CategoryInfo(BaseModel):
    name: str
    count: int
    found_count: int
    lost_count: int

@router.get("", response_model=List[CategoryInfo])
async def list_dynamic_categories(db: AsyncSession = Depends(get_db)):
    """
    Dynamically aggregations categories from both active lost and found items in campus custody,
    merged with baseline default categories. Updates automatically as items are reported.
    """
    # 1. Count found items per category
    found_stmt = (
        select(FoundItem.category, func.count(FoundItem.id))
        .where(FoundItem.status != "RETURNED")
        .group_by(FoundItem.category)
    )
    found_res = await db.execute(found_stmt)
    found_counts = {cat: count for cat, count in found_res.all() if cat}

    # 2. Count lost items per category
    lost_stmt = (
        select(LostItem.category, func.count(LostItem.id))
        .where(LostItem.status != "RETURNED")
        .group_by(LostItem.category)
    )
    lost_res = await db.execute(lost_stmt)
    lost_counts = {cat: count for cat, count in lost_res.all() if cat}

    # 3. Collect all distinct category names
    all_cat_names = set(DEFAULT_CATEGORIES)
    all_cat_names.update(found_counts.keys())
    all_cat_names.update(lost_counts.keys())

    # 4. Construct sorted category objects (categories with items first, then defaults alphabetically)
    results: List[CategoryInfo] = []
    for cat in all_cat_names:
        f_cnt = found_counts.get(cat, 0)
        l_cnt = lost_counts.get(cat, 0)
        total = f_cnt + l_cnt
        results.append(
            CategoryInfo(
                name=cat,
                count=total,
                found_count=f_cnt,
                lost_count=l_cnt,
            )
        )

    # Sort: categories with items first (descending count), then alphabetically
    results.sort(key=lambda c: (-c.count, c.name.lower()))
    return results
