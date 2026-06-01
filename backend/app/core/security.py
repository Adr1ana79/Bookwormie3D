from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv


# Зарежда environment променливите от .env файла
load_dotenv()

# Извлича настройките за JWT authentication
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

# Конфигурира bcrypt алгоритъм за хеширане на пароли
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Създава защитен хеш на подадената парола
def hash_password(password: str) -> str:
    return pwd_context.hash(password)


# Проверява дали подадената парола съвпада с хешираната парола
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


# Създава JWT access token с ограничено време на валидност
def create_access_token(data: dict):
    # Копира данните, които ще бъдат записани в token-а
    to_encode = data.copy()

    # Определя времето на валидност на access token-а
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})

    # Генерира JWT access token
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt


# Създава JWT refresh token с по-дълъг период на валидност
def create_refresh_token(data: dict):
    # Копира данните, които ще бъдат записани в token-а
    to_encode = data.copy()

    # Определя времето на валидност на refresh token-а
    expire = datetime.utcnow() + timedelta(days=7)

    # Добавя времето на изтичане към token payload-а
    to_encode.update({"exp": expire})

    # Генерира JWT refresh token
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
