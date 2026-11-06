from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.db.base import Base
from app.db.session import engine
from app.ai_engine.model_loader import model_loader

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    FastAPI lifespan handler:
    - Pre-warms AI models once on startup (eliminates latency spikes during requests).
    - Creates database tables if they do not exist.
    """
    print("Initiating FindBack startup lifecycle...")

    # 1. Initialize DB schema
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Database tables initialized successfully.")

    # 2. Pre-warm AI embedding models
    model_loader.prewarm_models()
    print("AI matching engine ready.")

    yield

    # 3. Clean up on shutdown
    await engine.dispose()
    print("FindBack shutdown lifecycle complete.")
