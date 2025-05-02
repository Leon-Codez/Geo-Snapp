
import os
import openai
from fastapi import HTTPException

# Load OpenAI API key from environment variable
openai.api_key = os.getenv("OPENAI_API_KEY")

def auto_flag_text(text: str):
    if not openai.api_key:
        raise HTTPException(status_code=500, detail="OpenAI API key not configured.")

    try:
        response = openai.Moderation.create(input=text)
        flagged = response["results"][0]["flagged"]
        categories = response["results"][0]["categories"]
        return {"flagged": flagged, "categories": categories}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
