from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from datetime import datetime
import psycopg2.extras

from db import get_connection  # Assumes you already have this in your project

app = FastAPI()

# ---------- Model ----------
class LocationInput(BaseModel):
    latitude: float
    longitude: float
    description: str = ""

class LocationOut(LocationInput):
    timestamp: datetime

# ---------- Auto-create Table on Startup ----------
@app.on_event("startup")
def create_location_table():
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute("""
        CREATE TABLE IF NOT EXISTS user_locations (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            latitude DOUBLE PRECISION NOT NULL,
            longitude DOUBLE PRECISION NOT NULL,
            timestamp TIMESTAMPTZ DEFAULT NOW(),
            description TEXT
        );
        """)
        conn.commit()
    except Exception as e:
        print("Error creating user_locations table:", e)
    finally:
        cur.close()
        conn.close()

# ---------- Endpoint: Add Location ----------
@app.post("/users/{user_id}/locations")
def add_location(user_id: int, location: LocationInput):
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            """
            INSERT INTO user_locations (user_id, latitude, longitude, description)
            VALUES (%s, %s, %s, %s)
            """,
            (user_id, location.latitude, location.longitude, location.description)
        )
        conn.commit()
        return {"message": "Location stored successfully"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

# ---------- Endpoint: Get All Locations for a User ----------
@app.get("/users/{user_id}/locations", response_model=List[LocationOut])
def get_user_locations(user_id: int):
    conn = get_connection()
    try:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            """
            SELECT latitude, longitude, timestamp, description
            FROM user_locations
            WHERE user_id = %s
            ORDER BY timestamp DESC
            """,
            (user_id,)
        )
        results = cur.fetchall()
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()
