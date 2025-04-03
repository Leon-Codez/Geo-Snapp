from pydantic import BaseModel
from typing import List
from datetime import datetime
from typing import List, Optional

class ProfileOut(BaseModel):
    username: str
    bio: str
    achievements: List[str]
    favorite_location: str
    profile_pic: str
    join_date: datetime  # or datetime if you want to format it later

class ProfileUpdate(BaseModel):
    bio: Optional[str] = None
    achievements: Optional[List[str]] = None
    favorite_location: Optional[str] = None
    profile_pic: Optional[str] = None