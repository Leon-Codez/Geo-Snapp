from fastapi import FastAPI, HTTPException
from db import get_connection
from models.user import UserCreate, UserLogin
from models.profile import ProfileOut, ProfileUpdate
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from datetime import datetime
import psycopg2.extras

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserCredentials(BaseModel):
    username: str
    password: str

class ProfileOut(BaseModel):
    user_id: int
    username: str
    bio: str
    achievements: List[str]
    favorite_location: str
    profile_pic: str
    join_date: datetime

@app.get("/")
def read_root():
    return {"message": "Geo-Snap API is running!"}

@app.get("/test-db")
def test_db_connection():
    conn = get_connection()
    if conn:
        return {"status": "Connected to database successfully!"}
    else:
        return {"status": "Database connection failed!"}

@app.post("/register")
def register_user(user: UserCredentials):
    conn = get_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed!")

    try:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        email = f"{user.username}@geosnap.local"

        cur.execute(
            """
            INSERT INTO users (username, email, password)
            VALUES (%s, %s, crypt(%s, gen_salt('bf')))
            RETURNING id;
            """,
            (user.username, email, user.password)
        )
        user_id = cur.fetchone()["id"]

        cur.execute(
            """
            INSERT INTO profile_cards (user_id, username, bio, achievements, favorite_location, profile_pic)
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (
                user_id,
                user.username,
                "This user hasn't set a bio yet.",
                ['Welcome to Geo-Snap!'],
                "Not yet discovered",
                "https://example.com/default-profile-pic.jpg"
            )
        )

        conn.commit()
        cur.close()
        conn.close()
        return {
            "message": "User and profile created successfully!",
            "user_id": user_id
        }

    except psycopg2.errors.UniqueViolation:
        conn.rollback()
        raise HTTPException(status_code=400, detail="Username or email already exists!")
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/login")
def login(user: UserCredentials):
    conn = get_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed!")

    try:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            """
            SELECT * FROM users
            WHERE username = %s AND password = crypt(%s, password);
            """,
            (user.username, user.password)
        )
        found_user = cur.fetchone()
        cur.close()
        conn.close()

        if not found_user:
            raise HTTPException(status_code=401, detail="Invalid username or password")
        return {
            "message": "Login successful!",
            "username": found_user["username"],
            "user_id": found_user["id"]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/get-profile/{username}", response_model=ProfileOut)
def get_profile(username: str):
    conn = get_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")

    try:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        cur.execute(
            """
            SELECT u.id AS user_id, u.username, p.bio, p.achievements, p.favorite_location, p.profile_pic, p.join_date
            FROM users u
            JOIN profile_cards p ON u.id = p.user_id
            WHERE u.username = %s;
            """,
            (username,)
        )
        result = cur.fetchone()

        if result and result["bio"] is None:
            cur.execute(
                """
                INSERT INTO profile_cards (user_id, username, bio, achievements, favorite_location, profile_pic)
                VALUES (%s, %s, %s, %s, %s, %s)
                """,
                (
                    result["user_id"],
                    result["username"],
                    "This user hasn't set a bio yet.",
                    ['Welcome to Geo-Snap!'],
                    "Not yet discovered",
                    "https://example.com/default-profile-pic.jpg"
                )
            )
            conn.commit()

            cur.execute(
                """
                SELECT u.id AS user_id, u.username, p.bio, p.achievements, p.favorite_location, p.profile_pic, p.join_date
                FROM users u
                JOIN profile_cards p ON u.id = p.user_id
                WHERE u.username = %s;
                """,
                (username,)
            )
            result = cur.fetchone()

        cur.close()
        conn.close()

        if not result:
            raise HTTPException(status_code=404, detail="Profile not found")

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/update-profile/{user_id}")
def update_profile(user_id: int, profile: ProfileUpdate):
    conn = get_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed!")

    cur = None
    try:
        cur = conn.cursor()

        fields = []
        values = []

        if profile.bio is not None:
            fields.append("bio = %s")
            values.append(profile.bio)
        if profile.achievements is not None:
            fields.append("achievements = %s")
            values.append(profile.achievements)
        if profile.favorite_location is not None:
            fields.append("favorite_location = %s")
            values.append(profile.favorite_location)
        if profile.profile_pic is not None:
            fields.append("profile_pic = %s")
            values.append(profile.profile_pic)

        if not fields:
            raise HTTPException(status_code=400, detail="No fields provided for update.")

        values.append(user_id)

        query = f"""
        UPDATE profile_cards
        SET {', '.join(fields)}
        WHERE user_id = %s
        """

        cur.execute(query, tuple(values))
        conn.commit()

        return {"message": "Profile updated successfully!"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

@app.delete("/delete-user/{user_id}")
def delete_user(user_id: int):
    conn = get_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed!")

    cur = None
    try:
        cur = conn.cursor()
        cur.execute("DELETE FROM users WHERE id = %s RETURNING id;", (user_id,))
        deleted = cur.fetchone()
        conn.commit()

        if not deleted:
            raise HTTPException(status_code=404, detail="User not found")

        return {"message": f"User with ID {user_id} deleted successfully."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

@app.get("/search-profiles")
def search_profiles(query: str):
    conn = get_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed!")

    cur = None
    try:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        cur.execute(
            """
            SELECT u.username, p.bio, p.favorite_location, p.achievements, p.profile_pic, p.join_date
            FROM users u
            JOIN profile_cards p ON u.id = p.user_id
            WHERE LOWER(u.username) LIKE LOWER(%s)
            """,
            (f"%{query}%",)
        )

        results = cur.fetchall()

        if not results:
            return {"message": "No matching profiles found."}

        return {"results": results}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

@app.get("/top-explorers")
def top_explorers():
    conn = get_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed!")

    cur = None
    try:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        cur.execute(
            """
            SELECT u.username, p.favorite_location, p.profile_pic, p.join_date,
                   CARDINALITY(p.achievements) AS achievement_count
            FROM users u
            JOIN profile_cards p ON u.id = p.user_id
            ORDER BY achievement_count DESC
            """
        )

        return {"top_explorers": cur.fetchall()}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

@app.get("/recent-users")
def recent_users():
    conn = get_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed!")

    cur = None
    try:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        cur.execute(
            """
            SELECT u.username, p.join_date, p.favorite_location, p.profile_pic,
                   CARDINALITY(p.achievements) AS achievement_count
            FROM users u
            JOIN profile_cards p ON u.id = p.user_id
            ORDER BY p.join_date ASC
            """
        )

        return {"recent_users": cur.fetchall()}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()
