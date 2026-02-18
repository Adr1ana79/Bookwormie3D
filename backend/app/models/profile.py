from sqlalchemy import Column, Integer, String, TIMESTAMP, text
from app.database import Base
from sqlalchemy import Table, ForeignKey
from sqlalchemy.orm import relationship
from app.models.genre import Genre
from app.models.social_network import SocialNetwork

profile_social_networks = Table(
    "profile_social_networks",
    Base.metadata,
    Column("profile_id", Integer, ForeignKey("profiles.id")),
    Column("social_network_id", Integer, ForeignKey("social_networks.id")),
    Column("profile_name", String(100))
)

profile_genres = Table(
    "profile_genres",
    Base.metadata,
    Column("profile_id", Integer, ForeignKey("profiles.id")),
    Column("genre_id", Integer, ForeignKey("genres.id"))
)

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), default="user")
    created_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))

    genres = relationship(
        Genre,
        secondary=profile_genres,
        backref="profiles"
    )

    social_networks = relationship(
        SocialNetwork,
        secondary=profile_social_networks,
        backref="profiles"
    )



