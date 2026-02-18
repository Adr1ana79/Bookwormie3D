from pydantic import BaseModel, EmailStr
from datetime import datetime


class ProfileCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class ProfileResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class GenresUpdate(BaseModel):
    genres: list[int]
