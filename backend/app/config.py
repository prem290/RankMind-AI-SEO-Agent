import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "RankMind AI"
    VERSION: str = "1.0.0"
    ENV: str = "production"
    DEMO_MODE: bool = False
    
    # Database
    DATABASE_URL: str = "sqlite:///./rankmind.db"
    
    # Hindsight Memory
    HINDSIGHT_BASE_URL: str = "http://localhost:8888"
    HINDSIGHT_API_KEY: str = ""
    HINDSIGHT_BANK_NAME: str = "rankmind-seo-memory"
    
    # LLM Provider
    GROQ_API_KEY: str = ""
    LLM_MODEL: str = "llama3-70b-8192"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
