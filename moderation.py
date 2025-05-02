from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import List, Optional
import uuid

router = APIRouter()

# Simulated in-memory data (replace with real DB for production)
flagged_content = []
user_violations = {}
admin_logs = []

# Models
class ContentReport(BaseModel):
    content_id: str
    reason: str

class UserReport(BaseModel):
    user_id: str
    reason: str

class AdminAction(BaseModel):
    admin_id: str
    action: str
    target: str
    details: Optional[str] = None

# Content Moderation
@router.get("/reports")
def get_flagged_content():
    return flagged_content

@router.delete("/content/{content_id}")
def delete_content(content_id: str):
    global flagged_content
    flagged_content = [c for c in flagged_content if c["content_id"] != content_id]
    return {"message": f"Content {content_id} removed."}

@router.post("/moderation/manual-review")
def manual_review(report: ContentReport):
    flagged_content.append(report.dict())
    return {"message": "Content submitted for review."}

# User Moderation
@router.get("/users/reports")
def get_user_reports():
    return user_violations

@router.post("/warn-user")
def warn_user(report: UserReport):
    user_id = report.user_id
    user_violations.setdefault(user_id, []).append("Warning")
    return {"message": f"User {user_id} warned."}

@router.post("/restrict-user")
def restrict_user(report: UserReport):
    user_id = report.user_id
    user_violations.setdefault(user_id, []).append("Restricted")
    return {"message": f"User {user_id} restricted."}

@router.post("/ban-user")
def ban_user(report: UserReport):
    user_id = report.user_id
    user_violations.setdefault(user_id, []).append("Banned")
    return {"message": f"User {user_id} banned."}

# Admin Overview
@router.get("/admin/overview")
def admin_overview():
    return {
        "flagged_content_count": len(flagged_content),
        "user_violations": user_violations
    }

@router.post("/admin/action-log")
def log_admin_action(action: AdminAction):
    log_entry = action.dict()
    log_entry["id"] = str(uuid.uuid4())
    admin_logs.append(log_entry)
    return {"message": "Admin action logged."}
