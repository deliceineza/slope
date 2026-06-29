from fastapi import APIRouter, Header

from models.prediction import PredictionRequest
from services.auth_service import verify_token
from services.predict_service import (
    build_features,
    compute_adjusted_weight,
    explain_prediction,
    identify_parcel_location,
    measure_accessibility,
    analyze_terrain,
    predict_price,
    read_planning_info,
)

router = APIRouter()


@router.post('/predict')
def predict(data: PredictionRequest, authorization: str | None = Header(default=None)):
    verify_token(authorization)

    parcel_location = identify_parcel_location(data.longitude, data.latitude)
    terrain = analyze_terrain(data.slope, data.longitude, data.latitude)
    accessibility = measure_accessibility(data.longitude, data.latitude)
    planning = read_planning_info(data.longitude, data.latitude, data.slope)
    adjusted_weight = compute_adjusted_weight(data.weight, data.slope)
    features = build_features(
        data.longitude,
        data.latitude,
        data.area,
        data.year,
        adjusted_weight,
        data.population,
        data.households,
    )

    prediction = predict_price(features, data.slope, data.area)
    debug_explanation = explain_prediction(
        terrain,
        accessibility,
        planning,
        data.slope,
        data.population,
    )

    return {
        "steps": [
            "Reading coordinates...",
            "Identifying land location...",
            "Analyzing terrain...",
            "Measuring accessibility...",
            "Reading planning information...",
            "Preparing AI features...",
            "Running AI valuation...",
        ],
        "parcel_location": parcel_location,
        "terrain": terrain,
        "accessibility": accessibility,
        "planning": planning,
        "adjusted_weight": adjusted_weight,
        "features": features,
        "prediction": prediction,
        "explanation": debug_explanation,
    }
