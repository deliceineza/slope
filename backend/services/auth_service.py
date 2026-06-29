from typing import Optional

from fastapi import HTTPException


DEMO_TOKEN = "slope-demo-token"


def verify_token(authorization: Optional[str]):
    if authorization != f"Bearer {DEMO_TOKEN}":
        raise HTTPException(status_code=401, detail="Invalid or missing token")
