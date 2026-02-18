from sqlalchemy import Column, Integer, String, TIMESTAMP, text
from app.database import Base

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), default="user")
    created_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))
