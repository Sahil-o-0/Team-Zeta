from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Adjust sqlite connection parameters to allow multi-threading in FastAPI
if settings.DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        settings.DATABASE_URL, connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Optional Supabase client initialization for direct storage / Auth functions
from typing import Optional
from supabase import create_client, Client
supabase_client: Optional[Client] = None
if settings.SUPABASE_URL and settings.SUPABASE_KEY:
    try:
        supabase_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
    except Exception as e:
        print(f"[Error] Failed to initialize Supabase client: {e}")

def get_db():
    """
    FastAPI dependency injection for getting a thread-safe database session.
    Rolls back automatically in case of errors.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
