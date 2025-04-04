from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ProfileOut(BaseModel):
    username: str
    bio: str
    achievements: List[str]
    favorite_location: str
    profile_pic: str
    join_date: datetime

class ProfileUpdate(BaseModel):
    bio: Optional[str] = None
    achievements: Optional[List[str]] = None
    favorite_location: Optional[str] = None
    profile_pic: Optional[str] = None
