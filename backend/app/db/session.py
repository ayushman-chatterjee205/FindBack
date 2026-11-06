import os
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.core.config import settings

# Determine database engine URL:
# If asyncpg is installed and postgres url is given, use PostgreSQL.
# Otherwise, fall back to aiosqlite for local standalone dev and pytest suites.
db_url = settings.DATABASE_URL
has_asyncpg = False
try:
    has_asyncpg = True
except ImportError:
    has_asyncpg = False

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
CANONICAL_DB_FILE = os.path.join(ROOT_DIR, "findback_dev.db").replace("\\", "/")

if not has_asyncpg or os.getenv("TESTING") or os.getenv("USE_SQLITE") or not os.getenv("DATABASE_URL"):
    db_url = f"sqlite+aiosqlite:///{CANONICAL_DB_FILE}"

engine = create_async_engine(
    db_url,
    echo=False,
    future=True,
    pool_pre_ping=True if "sqlite" not in db_url else False,
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
