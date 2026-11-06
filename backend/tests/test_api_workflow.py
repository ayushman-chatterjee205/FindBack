import pytest
from httpx import AsyncClient, ASGITransport
from datetime import datetime, timezone
from app.main import app
from app.db.base import Base
from app.db.session import engine

@pytest.mark.asyncio
async def test_full_campus_lost_and_found_lifecycle():
    # Setup test database schema
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    try:
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            # 1. Healthcheck
            health_res = await client.get("/health")
            assert health_res.status_code == 200
            assert health_res.json()["status"] == "healthy"

            # 2. Register Student
            student_data = {
                "email": "student_test@campus.edu",
                "password": "mypassword123",
                "full_name": "Test Student",
                "roll_number": "CS-2026-99",
                "role": "student"
            }
            reg_res = await client.post("/api/v1/auth/register", json=student_data)
            assert reg_res.status_code == 201
            student_user = reg_res.json()
            assert student_user["email"] == "student_test@campus.edu"

            # 3. Register Staff
            staff_data = {
                "email": "guard_test@campus.edu",
                "password": "guardpassword123",
                "full_name": "Officer Desk Guard",
                "role": "staff"
            }
            staff_reg_res = await client.post("/api/v1/auth/register", json=staff_data)
            assert staff_reg_res.status_code == 201

            # 4. Login Student
            login_res = await client.post("/api/v1/auth/login", json={
                "email": "student_test@campus.edu",
                "password": "mypassword123"
            })
            assert login_res.status_code == 200
            student_token = login_res.json()["access_token"]
            student_headers = {"Authorization": f"Bearer {student_token}"}

            # 5. Login Staff
            staff_login_res = await client.post("/api/v1/auth/login", json={
                "email": "guard_test@campus.edu",
                "password": "guardpassword123"
            })
            assert staff_login_res.status_code == 200
            staff_token = staff_login_res.json()["access_token"]
            staff_headers = {"Authorization": f"Bearer {staff_token}"}

            # 6. Student reports lost Casio calculator in CSE Block
            now_iso = datetime.now(timezone.utc).isoformat()
            lost_payload = {
                "title": "Casio fx-991EX ClassWiz",
                "category": "Electronics",
                "brand": "Casio",
                "color": "Black",
                "description": "Lost my scientific calculator during afternoon lab session",
                "secret_details": "Small dinosaur sticker on the back cover",
                "location_name": "CSE Block",
                "lost_timestamp": now_iso
            }
            lost_res = await client.post("/api/v1/lost-items", json=lost_payload, headers=student_headers)
            assert lost_res.status_code == 201
            lost_item = lost_res.json()
            lost_id = lost_item["id"]

            # 7. Staff registers found calculator turned in at CSE security desk
            found_payload = {
                "title": "Black Casio Scientific Calculator",
                "category": "Electronics",
                "storage_locker_bin": "Locker Bin B-07",
                "location_name": "CSE Block",
                "found_timestamp": now_iso,
                "description": "Found on 2nd floor desk in computer laboratory",
                "secret_details": "Sticker present on back cover"
            }
            found_res = await client.post("/api/v1/found-items", json=found_payload, headers=staff_headers)
            assert found_res.status_code == 201
            found_item = found_res.json()
            found_id = found_item["id"]

            # 8. Check Public Browse Catalog (Masked Data)
            browse_res = await client.get("/api/v1/found-items")
            assert browse_res.status_code == 200
            public_items = browse_res.json()
            assert len(public_items) >= 1
            first_item = next(i for i in public_items if i["id"] == found_id)
            assert "secret_details" not in first_item
            assert "storage_locker_bin" not in first_item

            # 9. Student checks AI candidate matches
            match_res = await client.get(f"/api/v1/matches/lost/{lost_id}", headers=student_headers)
            assert match_res.status_code == 200
            matches = match_res.json()
            assert len(matches) >= 1
            match = matches[0]
            assert match["composite_score"] >= 40.0
            match_id = match["id"]

            # 10. Student submits ownership challenge
            claim_payload = {
                "match_id": match_id,
                "proof_description": "There is a green dinosaur sticker on the sliding lid"
            }
            claim_res = await client.post("/api/v1/claims", json=claim_payload, headers=student_headers)
            assert claim_res.status_code == 201
            claim = claim_res.json()
            assert claim["status"] == "PENDING"
            claim_id = claim["id"]

            # 11. Staff reviews and approves claim
            review_res = await client.patch(
                f"/api/v1/claims/{claim_id}/review",
                json={"status": "APPROVED"},
                headers=staff_headers
            )
            assert review_res.status_code == 200
            assert review_res.json()["status"] == "APPROVED"

            # 12. Student generates dynamic 15-minute pickup pass
            pass_res = await client.post(f"/api/v1/claims/{claim_id}/generate-pass", headers=student_headers)
            assert pass_res.status_code == 200
            pickup_pass = pass_res.json()
            assert len(pickup_pass["handover_otp"]) == 6
            assert pickup_pass["handover_qr_token"].startswith("FB-PICKUP-")
            assert pickup_pass["storage_bin"] == "Locker Bin B-07"

            # 13. Staff verifies QR / OTP at security desk
            handover_res = await client.post(
                "/api/v1/claims/handover-verify",
                json={
                    "claim_id": claim_id,
                    "handover_otp": pickup_pass["handover_otp"]
                },
                headers=staff_headers
            )
            assert handover_res.status_code == 200
            assert handover_res.json()["success"] is True

            # 14. Check analytics KPIs
            kpi_res = await client.get("/api/v1/analytics/kpis")
            assert kpi_res.status_code == 200
            kpis = kpi_res.json()
            assert kpis["total_reconnected"] >= 1
    finally:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
