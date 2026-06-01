from pydantic import BaseModel, EmailStr
from datetime import datetime

# Описва данните за създаване на нов профил
class ProfileCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


# Описва данните, които backend-ът връща за потребителски профил
class ProfileResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    created_at: datetime

    class Config:
        # Позволява преобразуване на SQLAlchemy модели към Pydantic обекти
        from_attributes = True


# Описва данните за вход в системата
class LoginRequest(BaseModel):
    username: str
    password: str


# Описва структурата на JWT token отговора
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# Описва списък с избрани жанрове
class GenresUpdate(BaseModel):
    genres: list[int]
