from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings and configuration"""
    
    # Database
    # DATABASE_URL: str = "sqlite:///./dataaging.db"
    DATABASE_URL: str = "postgresql://pgdataaging:testing@localhost:55434/pgdataaging"
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # API
    API_V1_PREFIX: str = "/api/v1"
    PROJECT_NAME: str = "DataAging API"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()