from sqlalchemy import Column, Integer, String
from app.database import Base

# Описва таблицата с литературни жанрове
class Genre(Base):
    __tablename__ = "genres"

    id = Column(Integer, primary_key=True, index=True)
    genre_name_en = Column(String(50), unique=True)
    genre_name_bg = Column(String(50), unique=True)
