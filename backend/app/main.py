from fastapi import FastAPI
from fastapi import HTTPException
from fastapi.security import OAuth2PasswordBearer
from fastapi.security import OAuth2PasswordRequestForm
from fastapi import Depends
from fastapi import status
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy.orm import Session
from jose import JWTError, jwt
from datetime import datetime, timedelta
from sqlalchemy import or_

from app.database import engine
from app.models.profile import Profile
from app.schemas.profile import ProfileCreate, ProfileResponse
from app.schemas.profile import LoginRequest, TokenResponse
from app.database import get_db

from app.core.security import hash_password
from app.core.security import verify_password, create_access_token, create_refresh_token
from app.core.security import SECRET_KEY, ALGORITHM


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")

        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(Profile).filter(Profile.email == email).first()

    if user is None:
        raise HTTPException(status_code=401, detail="User not found")

    return user

def require_admin(current_user: Profile = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required"
        )
    return current_user


@app.get("/")
def root():
    return {"message": "Bookwormie3D backend is running"}


@app.get("/db-test")
def test_db():
    try:
        with engine.connect():
            return {"status": "Database connected successfully"}
    except Exception as e:
        return {"error": str(e)}


@app.post("/profiles", response_model=ProfileResponse)
def create_profile(profile: ProfileCreate, db: Session = Depends(get_db)):

    existing_user = db.query(Profile).filter(
        (Profile.username == profile.username) |
        (Profile.email == profile.email)
    ).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Username or email already exists")

    new_profile = Profile(
        username=profile.username,
        email=profile.email,
        password_hash=hash_password(profile.password)
    )

    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)

    return new_profile


@app.post("/login", response_model=TokenResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):

    user = db.query(Profile).filter(
        or_(
            Profile.username == form_data.username,
            Profile.email == form_data.username
        )
    ).first()

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
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }



@app.get("/me")
def read_current_user(current_user: str = Depends(get_current_user)):
    return {"logged_in_as": current_user}

@app.get("/profiles", response_model=list[ProfileResponse])
def get_profiles(
    current_user: Profile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Profile).all()

@app.get("/admin/profiles")
def get_all_profiles(
    db: Session = Depends(get_db),
    _: Profile = Depends(require_admin)
):
    return db.query(Profile).all()

@app.post("/refresh")
def refresh_token(refresh_token: str):
    payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
    new_access_token = create_access_token(data={"sub": payload["sub"]})
    return {"access_token": new_access_token}
