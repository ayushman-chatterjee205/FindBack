import pytest
from jose import jwt
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.config import settings

def test_password_hashing():
    raw = "super_secure_pass_123"
    hashed = get_password_hash(raw)
    assert hashed != raw
    assert verify_password(raw, hashed) is True
    assert verify_password("wrong_password", hashed) is False

def test_jwt_token_generation_and_decoding():
    user_id = "std-test-uuid-42"
    token = create_access_token(data={"sub": user_id, "role": "student"})
    payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.ALGORITHM])
    assert payload.get("sub") == user_id
    assert payload.get("role") == "student"
    assert "exp" in payload
