import os

from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

from routes.predict import router as predict_router
from services.predict_service import load_model

# Create FastAPI app
app = FastAPI(
    title="Slope Analysis API",
    description="Determines construction permit and land value based on slope",
    version="1.0.0"
)

MODEL_PATH = os.environ.get('MODEL_TOTAL_PATH', 'model_total.pkl')
load_model(MODEL_PATH)

# Enable CORS (so frontend can connect)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all origins (React, mobile, etc.)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model
class SlopeRequest(BaseModel):
    slope: float

 
class LoginRequest(BaseModel):
    username: str
    password: str


DEMO_USERNAME = "admin"
DEMO_PASSWORD = "admin123"
DEMO_TOKEN = "slope-demo-token"


def verify_token(authorization: Optional[str]):
    if authorization != f"Bearer {DEMO_TOKEN}":
        raise HTTPException(status_code=401, detail="Invalid or missing token")


# Home route (fixes "Not Found")
@app.get("/")
def home():
    return {
        "message": "Slope Analysis API is running",
        "docs": "/docs"
    }


@app.post("/login")
def login(data: LoginRequest):
    if data.username == DEMO_USERNAME and data.password == DEMO_PASSWORD:
        return {
            "message": "Login successful",
            "token": DEMO_TOKEN,
            "username": data.username
        }

    raise HTTPException(status_code=401, detail="Invalid username or password")


# Main analysis endpoint
@app.post("/analyze")
def analyze(data: SlopeRequest, authorization: Optional[str] = Header(default=None)):
    verify_token(authorization)

    slope = data.slope

    if slope <= 15:
        permit = "Standard Construction Permit"
        value = "Premium Pricing (High Value Land)"

    elif slope <= 20:
        permit = "High-Cost Permit Required"
        value = "Moderate Pricing"

    elif slope <= 30:
        permit = "No Permit Granted"
        value = "Discounted Pricing (Low Value)"

    else:
        permit = "No Permit Granted"
        value = "Non-Marketable (Unbuildable)"

    return {
        "slope": slope,
        "permit_status": permit,
        "land_value": value
    }

app.include_router(predict_router)
