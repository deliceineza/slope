from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Create FastAPI app
app = FastAPI(
    title="Slope Analysis API",
    description="Determines construction permit and land value based on slope",
    version="1.0.0"
)

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


# Home route (fixes "Not Found")
@app.get("/")
def home():
    return {
        "message": "Slope Analysis API is running",
        "docs": "/docs"
    }


# Main analysis endpoint
@app.post("/analyze")
def analyze(data: SlopeRequest):

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