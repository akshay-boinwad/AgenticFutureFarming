from pathlib import Path
from io import BytesIO

import joblib
import pandas as pd
from fastapi import FastAPI, File, UploadFile, HTTPException
from pydantic import BaseModel, Field
from PIL import Image, UnidentifiedImageError

app = FastAPI(
    title="Future Farming ML Service",
    description="Crop recommendation and crop disease API",
    version="1.1.0",
)

# Load the trained crop recommendation model.
BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "crop_recommendation_model.joblib"

try:
    model_artifact = joblib.load(MODEL_PATH)
    model = model_artifact["model"]
    feature_names = model_artifact["features"]
except Exception as exc:
    raise RuntimeError(
        f"Could not load crop recommendation model at {MODEL_PATH}"
    ) from exc

@app.get("/")
def health_check():
    return {
        "message": "Future Farming ML Service is running!",
        "status": "OK",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "crop_recommendation_model_loaded": True,
    }


@app.post("/api/crop/analyze")
async def analyze_crop(image: UploadFile = File(...)):
    if image.content_type not in [
        "image/jpeg",
        "image/png",
        "image/webp",
    ]:
        raise HTTPException(
            status_code=400,
            detail="Upload a JPG, PNG, or WEBP image.",
        )

    contents = await image.read()

    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=413,
            detail="Image must be smaller than 5 MB.",
        )

    try:
        with Image.open(BytesIO(contents)) as img:
            img.verify()
    except (UnidentifiedImageError, OSError):
        raise HTTPException(
            status_code=400,
            detail="The uploaded file is not a valid image.",
        )

    # Image validation only; a disease-classification model
    # has not been integrated yet.
    return {
        "success": True,
        "message": "Image received and validated successfully.",
        "prediction": None,
        "model_connected": False,
        "next_step": (
            "A trained crop disease classification model "
            "is still required for disease predictions."
        ),
    }


class CropRecommendationRequest(BaseModel):
    nitrogen: float = Field(ge=0, le=200)
    phosphorus: float = Field(ge=0, le=200)
    potassium: float = Field(ge=0, le=200)
    temperature: float = Field(ge=-10, le=60)
    humidity: float = Field(ge=0, le=100)
    ph: float = Field(ge=0, le=14)
    rainfall: float = Field(ge=0, le=5000)


@app.post("/api/crop/recommend")
def recommend_crop(request: CropRecommendationRequest):
    features = pd.DataFrame(
        [
            {
                "N": request.nitrogen,
                "P": request.phosphorus,
                "K": request.potassium,
                "temperature": request.temperature,
                "humidity": request.humidity,
                "ph": request.ph,
                "rainfall": request.rainfall,
            }
        ],
        columns=[
            "N",
            "P",
            "K",
            "temperature",
            "humidity",
            "ph",
            "rainfall",
        ],
    )

    prediction = str(model.predict(features)[0])

    return {
        "success": True,
        "model_connected": True,
        "message": "Crop recommendation generated successfully.",
        "recommendation": prediction,
        "inputs": request.dict(),
        "model_type": type(model).__name__,
        "disclaimer": (
            "This is a dataset-based prediction, not a guarantee "
            "of crop suitability. Verify local soil, weather, "
            "season, and agricultural guidance before planting."
        ),
    }