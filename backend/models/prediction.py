from pydantic import BaseModel


class PredictionRequest(BaseModel):
    longitude: float
    latitude: float
    slope: float
    area: float
    year: int
    weight: float
    population: int
    households: int
