import math
import os
import time
from datetime import datetime
from typing import Any, Dict, List, Optional

MODEL_TOTAL = None


def load_model(model_path: str):
    global MODEL_TOTAL
    if not model_path:
        MODEL_TOTAL = None
        return

    try:
        import joblib

        if os.path.exists(model_path):
            MODEL_TOTAL = joblib.load(model_path)
        else:
            MODEL_TOTAL = None
    except Exception:
        MODEL_TOTAL = None


def compute_adjusted_weight(weight: float, slope: float) -> float:
    return round(weight - (slope * 0.02), 4)


def identify_parcel_location(longitude: float, latitude: float) -> Dict[str, str]:
    district = "Gasabo" if latitude > -2 else "Kicukiro"
    sector = "Kacyiru" if longitude > 30 else "Gisozi"
    cell = "Kimihurura" if latitude > -1.95 else "Nyamirambo"
    boundaries = f"{district} District · {sector} Sector · {cell} Cell"
    return {
        "district": district,
        "sector": sector,
        "cell": cell,
        "administrative_boundaries": boundaries,
    }


def calculate_aspect(longitude: float, latitude: float) -> str:
    angle = int((longitude + latitude) * 10) % 360
    if angle < 45 or angle >= 315:
        return "North-facing"
    if angle < 135:
        return "East-facing"
    if angle < 225:
        return "South-facing"
    return "West-facing"


def analyze_terrain(slope: float, longitude: float, latitude: float) -> Dict[str, Any]:
    elevation = round(1200 + latitude * 12 - longitude * 2 + slope * 3, 1)
    aspect = calculate_aspect(longitude, latitude)
    if slope <= 5:
        terrain_class = "Flat"
    elif slope <= 12:
        terrain_class = "Gentle slope"
    elif slope <= 25:
        terrain_class = "Moderate slope"
    else:
        terrain_class = "Steep slope"

    return {
        "elevation": elevation,
        "slope": slope,
        "aspect": aspect,
        "terrain_class": terrain_class,
    }


def measure_accessibility(longitude: float, latitude: float) -> Dict[str, Any]:
    base_distance = abs(longitude - 30.05) * 8 + abs(latitude + 1.94) * 20
    distance_to_road = round(max(0.25, min(12, base_distance)), 2)
    distance_to_market = round(max(0.3, min(15, base_distance * 0.8)), 2)
    distance_to_school = round(max(0.5, min(18, base_distance * 0.95)), 2)
    distance_to_hospital = round(max(0.8, min(25, base_distance * 1.15)), 2)

    return {
        "distance_to_road": distance_to_road,
        "distance_to_market": distance_to_market,
        "distance_to_school": distance_to_school,
        "distance_to_hospital": distance_to_hospital,
    }


def read_planning_info(longitude: float, latitude: float, slope: float) -> Dict[str, str]:
    if longitude > 30.05 and latitude > -1.95:
        master_plan_zone = "Residential Growth Zone"
        land_use = "Mixed residential"
    else:
        master_plan_zone = "Agricultural Support Zone"
        land_use = "Agriculture"

    construction_permit_status = "Permit likely" if slope <= 20 else "Permit review required"
    return {
        "master_plan_zone": master_plan_zone,
        "land_use": land_use,
        "construction_permit_status": construction_permit_status,
    }


def build_features(
    longitude: float,
    latitude: float,
    area: float,
    year: int,
    adjusted_weight: float,
    population: int,
    households: int,
) -> List[float]:
    return [
        longitude,
        latitude,
        area,
        year,
        adjusted_weight,
        population,
        households,
    ]


def generate_demo_prediction(features: List[float], slope: float, area: float) -> float:
    longitude, latitude, _, year, adjusted_weight, population, households = features
    base_price = 180000 + adjusted_weight * 8500 + (population / 1200) * 9000 + (households / 90) * 4500
    location_bonus = (abs(longitude) % 1) * 2200 + (abs(latitude) % 1) * 1700
    time_bonus = max(0, (year - 2020) * 600)
    slope_penalty = slope * 1600
    predicted_price = base_price + location_bonus + time_bonus - slope_penalty
    predicted_price = max(65000, round(predicted_price, 2))
    return predicted_price


def predict_price(features: List[float], slope: float, area: float) -> Dict[str, Any]:
    start_time = time.perf_counter()
    model_used = "Demo Valuation Engine"
    status = "AI Prediction"
    confidence = "88%"

    if MODEL_TOTAL is not None:
        try:
            prediction = MODEL_TOTAL.predict([features])
            predicted_price = float(prediction[0])
            model_used = "Random Forest Regressor"
            status = "Model Prediction"
            confidence = "92%"
        except Exception:
            predicted_price = generate_demo_prediction(features, slope, area)
    else:
        predicted_price = generate_demo_prediction(features, slope, area)

    elapsed = round(time.perf_counter() - start_time, 4)
    parcel_value = round(predicted_price * area, 2)

    return {
        "predicted_price": round(predicted_price, 2),
        "estimated_price": round(predicted_price, 2),
        "parcel_value": parcel_value,
        "unit": "FRW/sqm",
        "status": status,
        "confidence": confidence,
        "model_used": model_used,
        "prediction_time": f"{elapsed:.2f} seconds",
        "timestamp": datetime.utcnow().isoformat() + "Z",
    }


def explain_prediction(
    terrain: Dict[str, Any],
    accessibility: Dict[str, Any],
    planning: Dict[str, str],
    slope: float,
    population: int,
) -> Dict[str, List[str]]:
    positive = []
    negative = []

    if terrain["terrain_class"] in {"Flat", "Gentle slope"}:
        positive.append("Flat terrain helps future development")
    else:
        negative.append("Slope is moderate to steep")

    if planning["land_use"] == "Mixed residential":
        positive.append("Master plan supports residential use")
    else:
        positive.append("Land is suitable for agriculture and open use")

    if accessibility["distance_to_road"] <= 1.5:
        positive.append("Easy access to the nearest road")
    else:
        negative.append("Far from the nearest road")

    if accessibility["distance_to_market"] <= 4:
        positive.append("Nearby markets support land value")
    else:
        negative.append("Market access is limited")

    if accessibility["distance_to_school"] <= 5:
        positive.append("Schools are within a reasonable distance")
    else:
        negative.append("Schools are somewhat far")

    if accessibility["distance_to_hospital"] <= 8:
        positive.append("Healthcare is reachable within a practical range")
    else:
        negative.append("Hospital distance is above ideal")

    if population >= 1500:
        positive.append("Growing local population improves demand")
    else:
        negative.append("Local population is still small")

    if planning["construction_permit_status"] == "Permit likely":
        positive.append("Construction permit is likely to be approved")
    else:
        negative.append("Permit approval may require additional review")

    return {"positive": positive, "negative": negative}
