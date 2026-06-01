from fastapi import FastAPI
from fastapi import HTTPException
from fastapi.security import OAuth2PasswordBearer
from fastapi.security import OAuth2PasswordRequestForm
from fastapi import Depends
from fastapi import status
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy.orm import Session
from jose import JWTError, jwt
from sqlalchemy import or_

from app.database import engine
from app.models.profile import Profile
from app.schemas.profile import ProfileCreate, ProfileResponse
from app.schemas.profile import LoginRequest, TokenResponse
from app.database import get_db

from app.core.security import hash_password
from app.core.security import verify_password, create_access_token, create_refresh_token
from app.core.security import SECRET_KEY, ALGORITHM


# Създава FastAPI приложението
app = FastAPI()
# Настройва CORS, за да позволи заявки от frontend приложението
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Дефинира начина, по който FastAPI извлича bearer token от заявките
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

# Извлича текущия потребител чрез подадения JWT access token
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    try:
        # Декодира token-а и извлича email адреса на потребителя
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")

        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    # Търси потребителя в базата данни по email адреса от token-а
    user = db.query(Profile).filter(Profile.email == email).first()

    if user is None:
        raise HTTPException(status_code=401, detail="User not found")


    return user

# Проверява дали текущият потребител има администраторски права
def require_admin(current_user: Profile = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required"
        )
    return current_user


# Проверява дали backend приложението работи
@app.get("/")
def root():
    return {"message": "Bookwormie3D backend is running"}


# Проверява дали връзката с базата данни е успешна
@app.get("/db-test")
def test_db():
    try:
        with engine.connect():
            return {"status": "Database connected successfully"}
    except Exception as e:
        return {"error": str(e)}


# Създава нов потребителски профил
@app.post("/profiles")
def create_profile(profile: ProfileCreate, db: Session = Depends(get_db)):

    # Проверява дали вече съществува потребител със същото име или email
    existing_user = db.query(Profile).filter(
        (Profile.username == profile.username) |
        (Profile.email == profile.email)
    ).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Username or email already exists")

    # Създава нов профил с хеширана парола
    new_profile = Profile(
        username=profile.username,
        email=profile.email,
        password_hash=hash_password(profile.password)
    )

    # Записва новия профил в базата данни
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)

    # Създава access token за новорегистрирания потребител
    access_token = create_access_token(
        data={
            "sub": new_profile.email,
            "role": new_profile.role
        }
    )

    # Създава refresh token за новорегистрирания потребител
    refresh_token = create_refresh_token(
        data={
            "sub": new_profile.email,
            "role": new_profile.role
        }
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "id": new_profile.id,
            "username": new_profile.username,
            "email": new_profile.email
        }
    }


# Обработва вход в системата чрез username/email и парола
@app.post("/login", response_model=TokenResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):

    # Търси потребител по потребителско име или email адрес
    user = db.query(Profile).filter(
        or_(
            Profile.username == form_data.username,
            Profile.email == form_data.username
        )
    ).first()

    # Проверява дали въведената парола съвпада със записания хеш
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(
        data={
            "sub": user.email,
            "role": user.role
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


# Връща информация за текущо вписания потребител
@app.get("/me")
def read_current_user(current_user: Profile = Depends(get_current_user)):

    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "role": current_user.role,
        "genres": [g.genre_name_en for g in current_user.genres],
        "socials": [
            sn.network_name for sn in current_user.social_networks
        ]
    }

# Изтрива текущо вписания потребителски профил
@app.delete("/me")
def delete_current_user(
    current_user: Profile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db.delete(current_user)
    db.commit()

    return {"message": "Profile deleted successfully"}


# Връща списък с всички профили за удостоверен потребител
@app.get("/profiles", response_model=list[ProfileResponse])
def get_profiles(
    current_user: Profile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Profile).all()


# Връща списък с всички профили само за администратор
@app.get("/admin/profiles")
def get_all_profiles(
    db: Session = Depends(get_db),
    _: Profile = Depends(require_admin)
):
    return db.query(Profile).all()


# Създава нов access token чрез подаден refresh token
@app.post("/refresh")
def refresh_token(refresh_token: str):
    payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
    new_access_token = create_access_token(data={"sub": payload["sub"]})
    return {"access_token": new_access_token}
