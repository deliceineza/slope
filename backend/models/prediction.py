from pydantic import BaseModel


class PredictionRequest(BaseModel):
    longitude: float
    latitude: float
    slope: float
    area: float | None = None
    year: int | None = None
    weight: float | None = None
    population: int | None = None
    households: int | None = None
