from functools import lru_cache

from pydantic import Field, computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Meridian API"
    VERSION: str = "0.1.0"
    ENVIRONMENT: str = "development"

    POSTGRES_SERVER: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str = "meridian"
    POSTGRES_PASSWORD: str = "meridian"
    POSTGRES_DB: str = "meridian"

    BACKEND_CORS_ORIGINS: str = Field(
        default="http://localhost:3000,http://127.0.0.1:3000"
    )

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @computed_field
    @property
    def database_url(self) -> str:
        return (
            "postgresql+psycopg://"
            f"{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )

    @property
    def cors_origins(self) -> list[str]:
        return [
            origin.strip()
            for origin in self.BACKEND_CORS_ORIGINS.split(",")
            if origin.strip()
        ]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
