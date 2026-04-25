import os
import firebase_admin
from firebase_admin import credentials, auth
from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="Nexis API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

# Configure Firebase Admin
try:
    cred = credentials.Certificate("firebase-adminsdk.json")
    firebase_admin.initialize_app(cred)
    firebase_configured = True
except Exception as e:
    print(f"Warning: Firebase Admin initialization failed: {e}")
    firebase_configured = False

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)
    # Using the standard model for generation
    model = genai.GenerativeModel('gemini-1.5-flash')
else:
    model = None
    print("Warning: GEMINI_API_KEY not found in environment.")

# Dependency for authenticating Firebase users
def verify_firebase_token(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")
    token = authorization.split("Bearer ")[1]
    try:
        if not firebase_configured:
            return {"uid": "mock-user-id"}
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid authentication credentials: {str(e)}")

class UserStats(BaseModel):
    weight: float
    height: float
    goal: str
    age: Optional[int] = 25
    gender: Optional[str] = "unspecified"
    activity_level: Optional[str] = "moderate"

@app.get("/")
def read_root():
    return {"message": "Welcome to AI Fitness Assistant API", "status": "active", "gemini_configured": model is not None}

@app.get("/api/dashboard")
def get_dashboard_data():
    return {
        "daily_calories": 2100,
        "calories_goal": 2500,
        "workouts_this_week": 4,
        "weekly_goal": 5,
        "recent_activities": [
            {"id": 1, "type": "Pushups", "reps": 30, "form_accuracy": 95, "date": "2026-04-23"},
            {"id": 2, "type": "Squats", "reps": 40, "form_accuracy": 88, "date": "2026-04-22"},
        ],
        "ai_recommendation": "Your squat form accuracy dropped slightly yesterday. Let's focus on keeping your back straight today."
    }

@app.post("/api/plan")
async def generate_workout_plan(stats: UserStats):
    if not model:
        raise HTTPException(status_code=500, detail="Gemini AI is not configured. Missing API Key.")
    
    prompt = f"""
    You are a world-class, elite AI fitness and nutrition coach.
    Create a highly optimized, custom 3-day workout plan and a daily nutrition summary for a user with these stats:
    Weight: {stats.weight}kg
    Height: {stats.height}cm
    Goal: {stats.goal}
    Age: {stats.age}
    Activity Level: {stats.activity_level}

    Return the result EXCLUSIVELY as a JSON object with this exact structure:
    {{
      "plan": [
        {{ "day": "Day 1", "focus": "...", "exercises": ["ex1", "ex2"] }},
        {{ "day": "Day 2", "focus": "...", "exercises": ["ex1", "ex2"] }},
        {{ "day": "Day 3", "focus": "...", "exercises": ["ex1", "ex2"] }}
      ],
      "nutrition": {{
        "calories": 2500,
        "protein_g": 150,
        "carbs_g": 200,
        "fat_g": 60
      }},
      "message": "A short, motivating 1-sentence message."
    }}
    Do not include markdown blocks like ```json ... ```, just the raw JSON text.
    """
    try:
        response = model.generate_content(prompt)
        # Clean the response to ensure it's pure JSON
        import json
        response_text = response.text.strip()
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
            
        data = json.loads(response_text)
        return data
    except Exception as e:
        print(f"Gemini API Error: {e}")
        # Fallback response
        return {
            "plan": [
                {"day": "Monday", "focus": "Chest & Triceps", "exercises": ["Bench Press", "Tricep Dips"]},
                {"day": "Wednesday", "focus": "Back & Biceps", "exercises": ["Pull-ups", "Bicep Curls"]},
                {"day": "Friday", "focus": "Legs & Core", "exercises": ["Squats", "Planks"]}
            ],
            "message": f"Custom plan generated via fallback for goal: {stats.goal}",
            "error": str(e)
        }

@app.post("/api/analyze-form")
def analyze_form():
    return {
        "status": "success",
        "exercise": "Pushup",
        "feedback": "Lower your hips slightly. Keep your core tight.",
        "score": 82
    }
