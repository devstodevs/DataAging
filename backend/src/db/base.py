from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config import settings
from typing import Set

# Create database engine
engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for models
Base = declarative_base()


def get_db():
    """Dependency to get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def _get_sqlite_columns(table_name: str) -> Set[str]:
    """Return a set with existing column names for a SQLite table."""
    if "sqlite" not in settings.DATABASE_URL:
        return set()
    with engine.connect() as conn:
        result = conn.exec_driver_sql(f"PRAGMA table_info({table_name})")
        rows = result.fetchall()
        return {row[1] for row in rows}  # row[1] is the column name


def ensure_schema():
    """Ensure runtime schema updates for SQLite without a migrations tool.

    Currently ensures the `users.recovery_hashed_password` column exists.
    Safe to run multiple times.
    """
    if "sqlite" in settings.DATABASE_URL:
        existing = _get_sqlite_columns("users")
        if existing and "recovery_hashed_password" not in existing:
            with engine.connect() as conn:
                with conn.begin():
                    conn.exec_driver_sql(
                        "ALTER TABLE users ADD COLUMN recovery_hashed_password VARCHAR"
                    )
