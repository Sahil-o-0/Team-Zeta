from pydantic_settings import BaseSettings
from pydantic import Field
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "ZETA Autonomous Workforce OS"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Security & Auth
    # In a real environment, load this from system env or Vault.
    JWT_SECRET: str = Field(default="zeta-super-secret-key-for-jwt-token-signing-auth-layer-2026", env="JWT_SECRET")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 1 week token expiry
    
    # Database
    # Hosted Supabase / PostgreSQL URI
    DATABASE_URL: str = Field(default="", env="DATABASE_URL")
    
    # Supabase Integration credentials
    SUPABASE_URL: str = Field(default="", env="SUPABASE_URL")
    SUPABASE_KEY: str = Field(default="", env="SUPABASE_KEY")
    
    # Autonomous Agent Thresholds
    CONFIDENCE_AUTONOMOUS_THRESHOLD: float = 0.80
    AGENT_MAX_RETRIES: int = 3
    
    # LLM Settings (Mock mode enabled by default to allow standalone execution without paid keys)
    USE_MOCK_LLM: bool = Field(default=True, env="USE_MOCK_LLM")
    OPENAI_API_KEY: str = Field(default="", env="OPENAI_API_KEY")
    ANTHROPIC_API_KEY: str = Field(default="", env="ANTHROPIC_API_KEY")
    GROQ_API_KEY: str = Field(default="", env="GROQ_API_KEY")
    GROQ_MODEL: str = Field(default="openai/gpt-oss-120b", env="GROQ_MODEL")
    
    # OpenRouter Config
    OPENROUTER_API_KEY: str = Field(default="", env="OPENROUTER_API_KEY")
    OPENROUTER_BASE_URL: str = Field(default="https://openrouter.ai/api/v1", env="OPENROUTER_BASE_URL")
    OPENROUTER_MODEL: str = Field(default="google/gemma-4-26b-a4b-it:free", env="OPENROUTER_MODEL")
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
