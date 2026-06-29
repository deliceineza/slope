from fastapi import APIRouter

from models.prediction import PredictionRequest
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

DEFAULT_AREA = 500.0
DEFAULT_YEAR = 2026
DEFAULT_WEIGHT = 1.0
DEFAULT_POPULATION = 1800
DEFAULT_HOUSEHOLDS = 420


@router.post('/predict')
def predict(data: PredictionRequest):
    area = data.area if data.area and data.area > 0 else DEFAULT_AREA
    year = data.year if data.year and data.year > 0 else DEFAULT_YEAR
    weight = data.weight if data.weight and data.weight > 0 else DEFAULT_WEIGHT
    population = data.population if data.population and data.population > 0 else DEFAULT_POPULATION
    households = data.households if data.households and data.households > 0 else DEFAULT_HOUSEHOLDS

    parcel_location = identify_parcel_location(data.longitude, data.latitude)
    terrain = analyze_terrain(data.slope, data.longitude, data.latitude)
    accessibility = measure_accessibility(data.longitude, data.latitude)
    planning = read_planning_info(data.longitude, data.latitude, data.slope)
    adjusted_weight = compute_adjusted_weight(weight, data.slope)
    features = build_features(
        data.longitude,
        data.latitude,
        area,
        year,
        adjusted_weight,
        population,
        households,
    )

    prediction = predict_price(features, data.slope, area)
    debug_explanation = explain_prediction(
        terrain,
        accessibility,
        planning,
        data.slope,
        population,
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
        "prediction": prediction,
        "explanation": debug_explanation,
    }
