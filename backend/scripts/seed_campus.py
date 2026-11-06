import asyncio
import os
import sys

# Ensure backend directory is in python search path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.db.session import async_session_factory, engine
from app.db.base import Base
from app.models.campus import CampusZone
from app.models.user import User
from app.core.security import get_password_hash

CAMPUS_SEEDS = [
    # ICT Block (6 Floors)
    {"name": "ICT Block Floor 1 - Reception & Tech Labs", "building": "ICT Block", "floor": "Floor 1", "room_number": "101"},
    {"name": "ICT Block Floor 2 - Software Engineering Labs", "building": "ICT Block", "floor": "Floor 2", "room_number": "201"},
    {"name": "ICT Block Floor 3 - AI & Networks Center", "building": "ICT Block", "floor": "Floor 3", "room_number": "301"},
    {"name": "ICT Block Floor 4 - Classrooms & Lecture Halls", "building": "ICT Block", "floor": "Floor 4", "room_number": "401"},
    {"name": "ICT Block Floor 5 - Faculty & Research Cabins", "building": "ICT Block", "floor": "Floor 5", "room_number": "501"},
    {"name": "ICT Block Floor 6 - Seminar Hall & Auditorium", "building": "ICT Block", "floor": "Floor 6", "room_number": "601"},

    # CME Block (6 Floors)
    {"name": "CME Block Floor 1 - Heavy Machinery & Workshops", "building": "CME Block", "floor": "Floor 1", "room_number": "101"},
    {"name": "CME Block Floor 2 - Design & CAD Lab", "building": "CME Block", "floor": "Floor 2", "room_number": "201"},
    {"name": "CME Block Floor 3 - Material Testing Lab", "building": "CME Block", "floor": "Floor 3", "room_number": "301"},
    {"name": "CME Block Floor 4 - Lecture Theatres", "building": "CME Block", "floor": "Floor 4", "room_number": "401"},
    {"name": "CME Block Floor 5 - Department Library & Faculty", "building": "CME Block", "floor": "Floor 5", "room_number": "501"},
    {"name": "CME Block Floor 6 - Conference & Innovation Hall", "building": "CME Block", "floor": "Floor 6", "room_number": "601"},

    # Central Block (6 Floors)
    {"name": "Central Block Floor 1 - Main Security Vault & Admin", "building": "Central Block", "floor": "Floor 1", "room_number": "101"},
    {"name": "Central Block Floor 2 - Registrar & Student Affairs", "building": "Central Block", "floor": "Floor 2", "room_number": "201"},
    {"name": "Central Block Floor 3 - Examination Wing", "building": "Central Block", "floor": "Floor 3", "room_number": "301"},
    {"name": "Central Block Floor 4 - Academic Council", "building": "Central Block", "floor": "Floor 4", "room_number": "401"},
    {"name": "Central Block Floor 5 - Directorate & Deans", "building": "Central Block", "floor": "Floor 5", "room_number": "501"},
    {"name": "Central Block Floor 6 - Grand Senate Auditorium", "building": "Central Block", "floor": "Floor 6", "room_number": "601"},

    # Central Library (Single Basement Floor)
    {"name": "Central Library Basement - Reading Hall & Book Stacks", "building": "Central Library", "floor": "Basement", "room_number": "B01"},

    # Campus Canteen (Indoor Only)
    {"name": "Campus Canteen Ground Floor - Main Food Court", "building": "Campus Canteen", "floor": "Ground Floor", "room_number": "Food Court"},
    {"name": "Campus Canteen Floor 1 - Mezzanine Dining", "building": "Campus Canteen", "floor": "Floor 1", "room_number": "Mezzanine"},
]

async def seed():
    print("Starting campus database seed...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session_factory() as session:
        # 1. Clean up legacy campus zones that are not in the approved locations
        approved_buildings = ["ICT Block", "CME Block", "Central Block", "Central Library", "Campus Canteen"]
        from sqlalchemy import delete, and_
        await session.execute(delete(CampusZone).where(~CampusZone.building.in_(approved_buildings)))
        # Clean up any non-basement Central Library records
        await session.execute(delete(CampusZone).where(and_(CampusZone.building == "Central Library", CampusZone.floor != "Basement")))

        # 2. Seed Campus Zones
        for data in CAMPUS_SEEDS:
            stmt = select(CampusZone).where(CampusZone.name == data["name"])
            res = await session.execute(stmt)
            if not res.scalar_one_or_none():
                zone = CampusZone(
                    name=data["name"],
                    building=data["building"],
                    floor=data["floor"],
                    room_number=data["room_number"],
                )
                session.add(zone)

        # 2. Seed Default Staff User
        staff_stmt = select(User).where(User.email == "guard@campus.edu")
        staff_res = await session.execute(staff_stmt)
        staff = staff_res.scalar_one_or_none()
        if not staff:
            staff = User(
                email="guard@campus.edu",
                password_hash=get_password_hash("guard1234"),
                full_name="Officer Sharma",
                role="staff",
            )
            session.add(staff)
            await session.flush()

        # 3. Seed Default Student User
        student_stmt = select(User).where(User.email == "student@campus.edu")
        student_res = await session.execute(student_stmt)
        student = student_res.scalar_one_or_none()
        if not student:
            student = User(
                email="student@campus.edu",
                password_hash=get_password_hash("student1234"),
                full_name="Ayushman Chatterjee",
                roll_number="2563002",
                role="student",
            )
            session.add(student)
            await session.flush()

        # 4. Seed Campus Security Officer (Dual Access: Student & Staff views)
        officer_stmt = select(User).where(User.email == "officer@campus.edu")
        officer_res = await session.execute(officer_stmt)
        officer = officer_res.scalar_one_or_none()
        if not officer:
            officer = User(
                email="officer@campus.edu",
                password_hash=get_password_hash("officer1234"),
                full_name="Campus Security Officer",
                role="staff",
            )
            session.add(officer)
            await session.flush()

        await session.commit()

        await session.commit()
        print("Campus zones and demo accounts seeded successfully! No synthetic items created.")

if __name__ == "__main__":
    asyncio.run(seed())
