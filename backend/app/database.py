import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv()

# Check for explicit local .env configuration or default to SQLite
DEFAULT_SQLITE = "sqlite:///./ai_revenue.db"
env_db_url = os.getenv("DATABASE_URL")

# Function to safely create engine with automatic SQLite fallback
def get_engine_and_url():
    if not env_db_url:
        return create_engine(DEFAULT_SQLITE, connect_args={"check_same_thread": False}), DEFAULT_SQLITE

    try:
        connect_args = {"check_same_thread": False} if env_db_url.startswith("sqlite") else {}
        test_engine = create_engine(env_db_url, connect_args=connect_args, echo=False)
        # Test connection
        with test_engine.connect() as conn:
            pass
        return test_engine, env_db_url
    except Exception as e:
        print(f"[Database Warning] Failed to connect to {env_db_url}: {e}")
        print("[Database Fallback] Switching to local SQLite database: ai_revenue.db")
        return create_engine(DEFAULT_SQLITE, connect_args={"check_same_thread": False}), DEFAULT_SQLITE

engine, DATABASE_URL = get_engine_and_url()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

