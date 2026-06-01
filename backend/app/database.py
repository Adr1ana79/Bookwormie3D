import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# Зарежда environment променливите от .env файла
load_dotenv()

# Извлича адреса за връзка с базата данни
DATABASE_URL = os.getenv("DATABASE_URL")

# Създава SQLAlchemy engine за работа с базата данни
engine = create_engine(DATABASE_URL)

# Конфигурира фабрика за създаване на database сесии
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Създава базов клас за всички SQLAlchemy модели
Base = declarative_base()

# Осигурява database сесия за FastAPI endpoint-ите.
def get_db():
    db = SessionLocal()
    try:
        # Предоставя активна database сесия
        yield db
    finally:
        # Затваря database сесията след приключване на заявката
        db.close()
