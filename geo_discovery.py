import math
from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict
from db import get_connection  # assumes existing DB setup using psycopg2

router = APIRouter()

# Haversine distance function (in km)
def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius in kilometers
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    d_phi = math.radians(lat2 - lat1)
    d_lambda = math.radians(lon2 - lon1)
    a = math.sin(d_phi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(d_lambda/2)**2
    return R * (2 * math.atan2(math.sqrt(a), math.sqrt(1 - a)))

@router.get("/nearby-posts")
def get_nearby_posts(lat: float = Query(...), lng: float = Query(...), radius_km: float = 5.0) -> List[Dict]:
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            """
            SELECT id, user_id, image_url, caption, latitude, longitude, created_at
            FROM posts;
            """
        )
        results = cur.fetchall()
        keys = [desc[0] for desc in cur.description]

        nearby = []
        for row in results:
            row_data = dict(zip(keys, row))
            post_lat, post_lng = row_data["latitude"], row_data["longitude"]
            distance = haversine(lat, lng, post_lat, post_lng)
            if distance <= radius_km:
                row_data["distance_km"] = round(distance, 2)
                nearby.append(row_data)

        return nearby
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()
