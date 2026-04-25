# Nexis - Unified AI-Powered Fitness Ecosystem

## Overview
Nexis is a comprehensive fitness ecosystem that acts as a smart personal trainer, dietician, motivator, and data-driven fitness manager. 

### Key Features:
- **AI-Powered Form Analysis**: Uses computer vision to analyze workout form in real-time.
- **Smart Diet Recommendations**: Generates custom meal plans using LLMs based on performance and goals.
- **Data-Driven Dashboard**: Beautiful, real-time analytics for workouts, calories, and habits.
- **Dynamic Plan Adjustments**: Adapts weekly workout plans based on your progress.

## Tech Stack
- **Frontend**: Next.js 14, React, Tailwind CSS 4, Framer Motion, Recharts
- **Backend**: Python, FastAPI, Uvicorn (ready for ML integration)
- **AI/ML Layer (Planned)**: MediaPipe for pose detection, Hugging Face/OpenAI for conversational AI.

## Getting Started

### 1. Frontend Setup
Navigate to the `frontend` directory:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` to view the beautiful dashboard.

### 2. Backend Setup
Navigate to the `backend` directory:
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
The FastAPI backend will be running at `http://localhost:8000`. Access `http://localhost:8000/docs` for the interactive API documentation.

## Next Steps
- Integrate MediaPipe in the frontend for live webcam skeleton tracking.
- Connect the frontend dashboard to the FastAPI backend.
- Set up a MongoDB/PostgreSQL database to store user historical data.
- Deploy to Vercel (Frontend) and AWS/Render (Backend).
