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
    import json
    service_account_env = os.getenv("FIREBASE_SERVICE_ACCOUNT")
    if service_account_env:
        cred_dict = json.loads(service_account_env)
        cred = credentials.Certificate(cred_dict)
    else:
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

@app.post("/api/fuel-plan")
async def generate_fuel_plan(stats: UserStats):
    if not model:
        raise HTTPException(status_code=500, detail="Gemini AI is not configured. Missing API Key.")
    
    prompt = f"""
    You are a world-class, elite AI clinical nutritionist.
    Create a highly optimized, custom 1-day meal plan for a user with these stats:
    Weight: {stats.weight}kg
    Height: {stats.height}cm
    Goal: {stats.goal}
    Age: {stats.age}
    Activity Level: {stats.activity_level}

    Return the result EXCLUSIVELY as a JSON object with this exact structure:
    {{
      "nutrition": {{
        "calories": 2500,
        "protein_g": 150,
        "carbs_g": 200,
        "fat_g": 60
      }},
      "meals": [
        {{ "name": "Breakfast", "food": "Oatmeal with Berries", "macros": "P: 10g | C: 40g | F: 5g", "search_term": "Oats" }},
        {{ "name": "Mid-Morning Snack", "food": "Protein Shake & Almonds", "macros": "P: 25g | C: 5g | F: 10g", "search_term": "Almonds" }},
        {{ "name": "Lunch", "food": "Grilled Chicken Salad", "macros": "P: 40g | C: 15g | F: 12g", "search_term": "Chicken Breast" }},
        {{ "name": "Pre-Workout", "food": "Banana & Peanut Butter", "macros": "P: 8g | C: 30g | F: 16g", "search_term": "Peanut Butter" }},
        {{ "name": "Dinner", "food": "Salmon and Quinoa", "macros": "P: 35g | C: 30g | F: 20g", "search_term": "Salmon" }},
        {{ "name": "Evening Snack", "food": "Greek Yogurt", "macros": "P: 15g | C: 10g | F: 0g", "search_term": "Greek Yogurt" }}
      ],
      "message": "A short, motivating 1-sentence message."
    }}
    Do not include markdown blocks like ```json ... ```, just the raw JSON text.
    """
    try:
        response = model.generate_content(prompt)
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
        return {
            "nutrition": {"calories": 2000, "protein_g": 120, "carbs_g": 200, "fat_g": 50},
            "meals": [
                {"name": "Breakfast", "food": "Eggs & Avocado", "macros": "P: 20g | C: 5g | F: 15g", "search_term": "Eggs"},
                {"name": "Lunch", "food": "Chicken Rice Bowl", "macros": "P: 40g | C: 45g | F: 10g", "search_term": "Chicken Breast"}
            ],
            "message": "Custom fuel plan generated via fallback.",
            "error": str(e)
        }

class ChatMessage(BaseModel):
    message: str
    history: Optional[List[dict]] = []

@app.post("/api/chat")
async def chat_with_buddy(msg: ChatMessage):
    if not model:
        raise HTTPException(status_code=500, detail="Gemini AI is not configured. Missing API Key.")

    system_prompt = """You are NEXIS, an elite AI virtual gym buddy and motivational fitness companion. 
    Your personality traits:
    - You are intensely motivational but never toxic. You push users to be their best.
    - You use fitness/military-style language mixed with genuine empathy.
    - You track emotional states — if a user seems down, you adapt your tone to be supportive.
    - You give actionable fitness, nutrition, and mindset advice.
    - Keep responses concise (2-4 sentences max) and punchy. No walls of text.
    - Use occasional emojis like 🔥💪⚡ but don't overdo it.
    - If someone asks non-fitness questions, gently redirect to wellness topics.
    - Address users as "Operative" occasionally to keep the NEXIS theme.
    """

    # Build conversation history for context
    chat_history = ""
    for entry in (msg.history or []):
        role = entry.get("role", "user")
        text = entry.get("text", "")
        chat_history += f"\n{role}: {text}"
    
    full_prompt = f"""{system_prompt}

Conversation so far:{chat_history}
user: {msg.message}

Respond as NEXIS:"""

    try:
        response = model.generate_content(full_prompt)
        return {"reply": response.text.strip()}
    except Exception as e:
        print(f"Chat Error: {e}")
        return {"reply": "Systems temporarily overloaded, Operative. Let's regroup — what's your training focus today? 💪"}

@app.post("/api/analyze-form")
def analyze_form():
    return {
        "status": "success",
        "exercise": "Pushup",
        "feedback": "Lower your hips slightly. Keep your core tight.",
        "score": 82
    }
