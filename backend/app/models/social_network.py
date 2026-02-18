from sqlalchemy import Column, Integer, String
from app.database import Base

class SocialNetwork(Base):
    __tablename__ = "social_networks"

    id = Column(Integer, primary_key=True, index=True)
    network_name = Column(String(50), unique=True)
