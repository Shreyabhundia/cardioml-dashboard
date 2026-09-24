"""
main.py  –  CardioML FastAPI Backend
=====================================
Endpoints:
  POST /predict          → returns CVD risk from trained GradientBoosting model
  GET  /model-info       → returns model metadata (features, accuracy, params)
  GET  /health           → health check
"""

import os
import pickle
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# ─── App setup ────────────────────────────────────────────────────────────────
app = FastAPI(
    title="CardioML API",
    description="Cardiovascular disease risk prediction powered by GradientBoosting",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Load model bundle at startup ─────────────────────────────────────────────
PKL_PATH = os.path.join(os.path.dirname(__file__), "best_cardio_model.pkl")

model_bundle: dict = {}

@app.on_event("startup")
def load_model():
    global model_bundle
    if not os.path.exists(PKL_PATH):
        print(f"[WARN] {PKL_PATH} not found. Run train_and_save_model.py first.")
        return
    with open(PKL_PATH, "rb") as f:
        model_bundle = pickle.load(f)
    print(f"[OK] Model loaded: {type(model_bundle['model']).__name__}")
    print(f"     Features  : {model_bundle['features']}")
    print(f"     Accuracy  : {model_bundle['accuracy']:.2f}%")


# ─── Request / Response schemas ───────────────────────────────────────────────
class PredictRequest(BaseModel):
    age:         float = Field(..., ge=18,  le=100, description="Age in years")
    gender:      int   = Field(..., ge=1,   le=2,   description="1=Female, 2=Male")
    height:      float = Field(..., ge=100, le=250, description="Height in cm")
    weight:      float = Field(..., ge=20,  le=300, description="Weight in kg")
    ap_hi:       float = Field(..., ge=60,  le=260, description="Systolic blood pressure (mmHg)")
    ap_lo:       float = Field(..., ge=30,  le=200, description="Diastolic blood pressure (mmHg)")
    cholesterol: int   = Field(..., ge=1,   le=3,   description="1=Normal, 2=Above Normal, 3=Well Above Normal")
    gluc:        int   = Field(..., ge=1,   le=3,   description="1=Normal, 2=Above Normal, 3=Well Above Normal")
    smoke:       int   = Field(..., ge=0,   le=1,   description="0=Non-smoker, 1=Smoker")
    alco:        int   = Field(..., ge=0,   le=1,   description="0=No alcohol, 1=Regular")
    active:      int   = Field(..., ge=0,   le=1,   description="1=Active, 0=Inactive")


class ContributorItem(BaseModel):
    feature: str
    val:     str
    impact:  str
    level:   str


class PredictResponse(BaseModel):
    riskPercentage:  int
    riskLevel:       str
    riskColor:       str
    statusText:      str
    bmi:             str
    bmiCategory:     str
    bpCategory:      str
    pulsePressure:   float
    contributors:    list[ContributorItem]
    recommendations: list[str]
    modelSource:     str   # "api" | "fallback"


# ─── Helper functions ──────────────────────────────────────────────────────────
def classify_bp(ap_hi: float, ap_lo: float) -> str:
    if ap_hi >= 140 or ap_lo >= 90:
        return "Stage 2 Hypertension"
    if ap_hi >= 130 or ap_lo >= 80:
        return "Stage 1 Hypertension"
    if ap_hi >= 120 and ap_lo < 80:
        return "Elevated Blood Pressure"
    return "Normal"


def classify_bmi(bmi: float) -> str:
    if bmi >= 30:   return "Obese"
    if bmi >= 25:   return "Overweight"
    if bmi < 18.5:  return "Underweight"
    return "Normal weight"


def build_contributors(req: PredictRequest, bmi: float, bmi_cat: str) -> list[dict]:
    contributors = []
    if req.ap_hi >= 130:
        contributors.append({
            "feature": "Systolic Blood Pressure",
            "val": f"{req.ap_hi} mmHg",
            "impact": "+ High Contribution (+38%)",
            "level": "high",
        })
    if req.age >= 50:
        contributors.append({
            "feature": "Vascular Age Factor",
            "val": f"{req.age} years",
            "impact": "+ Moderate Contribution (+18%)",
            "level": "medium",
        })
    if req.cholesterol > 1:
        contributors.append({
            "feature": "Cholesterol Status",
            "val": "Above Normal" if req.cholesterol == 2 else "Well Above Normal",
            "impact": "+ High Impact (+15%)" if req.cholesterol == 3 else "+ Moderate Impact (+8%)",
            "level": "high" if req.cholesterol == 3 else "medium",
        })
    if bmi >= 25:
        contributors.append({
            "feature": "Body Mass Index",
            "val": f"{bmi:.1f} ({bmi_cat})",
            "impact": "+ Elevated Load (+12%)",
            "level": "medium",
        })
    if req.smoke == 1:
        contributors.append({
            "feature": "Tobacco Consumption",
            "val": "Active Smoker",
            "impact": "+ Endothelial Damage (+9%)",
            "level": "medium",
        })
    if req.active == 1:
        contributors.append({
            "feature": "Physical Activity",
            "val": "Active (≥150 min/wk)",
            "impact": "- Cardioprotective (-12%)",
            "level": "protective",
        })
    return contributors


def build_recommendations(req: PredictRequest, bmi: float) -> list[str]:
    recs = []
    if req.ap_hi >= 130 or req.ap_lo >= 80:
        recs.append("Consult a cardiologist for a 24-hour ambulatory blood pressure monitoring (ABPM).")
        recs.append("Adopt the DASH diet to lower sodium intake.")
    if req.cholesterol > 1:
        recs.append("Order a full Lipid Profile test (LDL, HDL, Triglycerides, ApoB).")
        recs.append("Increase soluble fiber intake and reduce saturated fats.")
    if bmi >= 25:
        recs.append("Target a gradual 5-10% body weight reduction over 6 months to lower cardiac strain.")
    if req.smoke == 1:
        recs.append("Initiate a smoking cessation plan; risk drops significantly within 1 year of quitting.")
    if req.active == 0:
        recs.append("Aim for at least 150 minutes of moderate-intensity aerobic exercise weekly.")
    if not recs:
        recs.append("Maintain current healthy lifestyle habits with annual routine health checkups.")
        recs.append("Keep blood pressure and cholesterol levels monitored regularly.")
    return recs


# ─── Routes ───────────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    model_loaded = bool(model_bundle)
    return {
        "status": "ok",
        "model_loaded": model_loaded,
        "model_type": type(model_bundle.get("model")).__name__ if model_loaded else None,
    }


@app.get("/model-info")
def model_info():
    if not model_bundle:
        raise HTTPException(status_code=503, detail="Model not loaded. Run train_and_save_model.py first.")
    return {
        "model_type": type(model_bundle["model"]).__name__,
        "accuracy":   round(model_bundle["accuracy"], 2),
        "features":   model_bundle["features"],
        "params":     model_bundle["params"],
    }


@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    if not model_bundle:
        raise HTTPException(status_code=503, detail="Model not loaded. Run train_and_save_model.py first.")

    model  = model_bundle["model"]
    scaler = model_bundle["scaler"]

    # Compute BMI (must be included as a feature since model was trained with it)
    bmi = req.weight / ((req.height / 100) ** 2)

    # Build feature array in the exact order the model was trained on
    features_order = model_bundle["features"]  # e.g. ['age','gender','height','weight','ap_hi','ap_lo','cholesterol','gluc','smoke','alco','active','bmi']

    feature_values = {
        "age": req.age,
        "gender": req.gender,
        "height": req.height,
        "weight": req.weight,
        "ap_hi": req.ap_hi,
        "ap_lo": req.ap_lo,
        "cholesterol": req.cholesterol,
        "gluc": req.gluc,
        "smoke": req.smoke,
        "alco": req.alco,
        "active": req.active,
        "bmi": bmi,
    }

    X_raw = np.array([[feature_values[f] for f in features_order]])
    X_scaled = scaler.transform(X_raw)

    # Model prediction
    prob = model.predict_proba(X_scaled)[0][1]  # P(cardio=1)
    risk_pct = int(min(max(round(prob * 100), 3), 98))

    # Risk level
    if risk_pct >= 65:
        risk_level, risk_color, status_text = "HIGH",     "crimson", "Elevated Cardiovascular Risk Detected"
    elif risk_pct >= 35:
        risk_level, risk_color, status_text = "MODERATE", "amber",   "Moderate Cardiovascular Risk"
    else:
        risk_level, risk_color, status_text = "LOW",      "emerald", "Low Cardiovascular Risk"

    bmi_cat   = classify_bmi(bmi)
    bp_cat    = classify_bp(req.ap_hi, req.ap_lo)
    pulse_p   = req.ap_hi - req.ap_lo
    contribs  = build_contributors(req, bmi, bmi_cat)
    recs      = build_recommendations(req, bmi)

    return PredictResponse(
        riskPercentage  = risk_pct,
        riskLevel       = risk_level,
        riskColor       = risk_color,
        statusText      = status_text,
        bmi             = f"{bmi:.1f}",
        bmiCategory     = bmi_cat,
        bpCategory      = bp_cat,
        pulsePressure   = pulse_p,
        contributors    = contribs,
        recommendations = recs,
        modelSource     = "api",
    )
