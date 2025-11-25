from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "PlayMaker API"
    API_V1_STR: str = "/api/v1"
    
    # External APIs
    ODDS_API_KEY: Optional[str] = None
    
    # Supabase
    SUPABASE_URL: Optional[str] = None
    SUPABASE_KEY: Optional[str] = None

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
