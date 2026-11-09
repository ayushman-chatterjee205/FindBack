import os
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.pool import StaticPool
from app.core.config import settings

# Determine database engine URL:
# If asyncpg is installed and postgres url is given, use PostgreSQL.
# Otherwise, fall back to aiosqlite for local standalone dev and pytest suites.
db_url = settings.DATABASE_URL
has_asyncpg = False
try:
    import asyncpg
    has_asyncpg = True
except ImportError:
    has_asyncpg = False

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
CANONICAL_DB_FILE = os.path.join(ROOT_DIR, "findback_dev.db").replace("\\", "/")

if os.getenv("TESTING"):
    db_url = "sqlite+aiosqlite:///./findback_test.db"
elif os.getenv("USE_SQLITE") or not os.getenv("DATABASE_URL") or not has_asyncpg:
    db_url = f"sqlite+aiosqlite:///{CANONICAL_DB_FILE}"

if "sqlite" in db_url:
    engine = create_async_engine(
        db_url,
        echo=False,
        future=True,
        poolclass=StaticPool,
        connect_args={"check_same_thread": False, "timeout": 30},
    )
else:
    engine = create_async_engine(
        db_url,
        echo=False,
        future=True,
        pool_pre_ping=True,
    )

async_session_factory = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency for providing database sessions per request."""
    async with async_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
