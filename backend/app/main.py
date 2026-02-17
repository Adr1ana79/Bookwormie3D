from fastapi import FastAPI
from app.database import engine
from app.models.profile import Profile
from app.shemas.profile import ProfileCreate, ProfileResponse

from sqlalchemy.orm import Session
from fastapi import Depends
from app.database import get_db
from app.core.security import hash_password
from fastapi import HTTPException


app = FastAPI()


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
    # Проверка дали username или email вече съществуват
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


#
# from sqlalchemy import text
#
# @app.get("/where-am-i")
# def where_am_i(db: Session = Depends(get_db)):
#     result = db.execute(text("SELECT current_database();"))
#     return {"database": result.scalar()}
#
