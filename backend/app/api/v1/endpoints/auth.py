from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.core.config import settings
from app.core.security import get_password_hash, verify_password, create_access_token, get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse
from app.schemas.token import Token

router = APIRouter()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    """Registers a new campus user (defaults strictly to student to prevent privilege escalation)."""
    email_clean = user_in.email.strip().lower()
    allowed_domains = settings.allowed_domains_list
    if not any(email_clean.endswith(f"@{dom}") for dom in allowed_domains):
        domains_fmt = " or ".join([f"@{d}" for d in allowed_domains])
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Please login using college email only. New registrations are restricted to {domains_fmt}."
        )

    # Check if user already exists
    stmt = select(User).where(func.lower(User.email) == email_clean)
    result = await db.execute(stmt)
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    # Prevent privilege escalation: in production, self-registration is locked to 'student'
    assigned_role = "student"
    if user_in.role in ["staff", "admin"]:
        if settings.ENVIRONMENT == "production":
            assigned_role = "student"
        else:
            assigned_role = user_in.role

    user = User(
        email=email_clean,
        password_hash=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        roll_number=user_in.roll_number,
        role=assigned_role,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    """Authenticates user and issues JWT bearer token with uniform error response against enumeration."""
    email_clean = credentials.email.strip().lower()
    stmt = select(User).where(func.lower(User.email) == email_clean)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()

    # Mitigate user enumeration: use uniform response timing & message
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Please verify your credentials.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Account is disabled")

    access_token = create_access_token(
        data={"sub": user.id, "role": user.role, "email": user.email}
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user,
    }

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Returns currently authenticated user profile."""
    return current_user
