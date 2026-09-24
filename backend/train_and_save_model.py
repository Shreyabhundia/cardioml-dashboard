"""
train_and_save_model.py
-----------------------
Trains the best cardio disease model from task-5-model-evaluation logic
and saves it as best_cardio_model.pkl in the backend directory.

Run once:  python train_and_save_model.py
"""

import os
import pickle
import pandas as pd
import numpy as np
import warnings

from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import accuracy_score

warnings.filterwarnings("ignore")

# ── Locate dataset ────────────────────────────────────────────────────────────
BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
ML_PROJECT = os.path.join(BASE_DIR, "..", "..")          # ../../  → ML-project
XLSX_PATH  = os.path.join(ML_PROJECT, "cardio_train.csv.xlsx")
CSV_PATH   = os.path.join(ML_PROJECT, "cardio_train.csv")

if os.path.exists(XLSX_PATH):
    df = pd.read_excel(XLSX_PATH)
    print(f"Loaded from Excel: {XLSX_PATH}")
elif os.path.exists(CSV_PATH):
    df = pd.read_csv(CSV_PATH, sep=";")
    print(f"Loaded from CSV: {CSV_PATH}")
else:
    raise FileNotFoundError(
        "Dataset not found. Place cardio_train.csv.xlsx in the ML-project folder."
    )

print(f"Raw shape: {df.shape}")

# ── Preprocessing (mirrors task-5-model-evaluation.ipynb) ────────────────────
if "id" in df.columns:
    df.drop(columns=["id"], inplace=True)

# Remove outliers
df = df[(df["ap_hi"]  >= 80)  & (df["ap_hi"]  <= 240)]
df = df[(df["ap_lo"]  >= 40)  & (df["ap_lo"]  <= 160)]
df = df[(df["height"] >= 130) & (df["height"] <= 220)]
df = df[(df["weight"] >= 30)  & (df["weight"] <= 200)]

# Feature engineering
df["bmi"] = df["weight"] / ((df["height"] / 100) ** 2)

# Age in days → years
if df["age"].max() > 200:
    df["age"] = (df["age"] / 365).round(1)

print(f"Cleaned shape: {df.shape}")

# ── Train / Test split & scaling ─────────────────────────────────────────────
X = df.drop(columns=["cardio"])
y = df["cardio"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

scaler = StandardScaler()
X_train_sc = scaler.fit_transform(X_train)
X_test_sc  = scaler.transform(X_test)

print(f"Train: {X_train_sc.shape}  |  Test: {X_test_sc.shape}")

# ── Hyperparameter tuning (matches notebook Section 5) ───────────────────────
print("\nRunning GridSearchCV for GradientBoostingClassifier ...")
param_grid = {
    "n_estimators" : [100, 200],
    "learning_rate": [0.05, 0.1],
    "max_depth"    : [3, 5],
    "subsample"    : [0.8, 1.0],
}

gb_clf = GradientBoostingClassifier(random_state=42)
grid_search = GridSearchCV(
    gb_clf, param_grid, cv=5,
    scoring="accuracy", n_jobs=-1, verbose=1
)
grid_search.fit(X_train_sc, y_train)

best_params = grid_search.best_params_
best_clf    = grid_search.best_estimator_

print(f"\nBest Params : {best_params}")
print(f"Best CV Acc : {grid_search.best_score_*100:.2f}%")

# Evaluate on test set
y_pred    = best_clf.predict(X_test_sc)
tuned_acc = accuracy_score(y_test, y_pred) * 100
print(f"Test Accuracy: {tuned_acc:.2f}%")

# ── Save model bundle ─────────────────────────────────────────────────────────
PKL_PATH = os.path.join(BASE_DIR, "best_cardio_model.pkl")

bundle = {
    "model"   : best_clf,
    "scaler"  : scaler,
    "params"  : best_params,
    "features": list(X.columns),   # age, gender, height, weight, ap_hi, ap_lo, cholesterol, gluc, smoke, alco, active, bmi
    "accuracy": tuned_acc,
}

with open(PKL_PATH, "wb") as f:
    pickle.dump(bundle, f)

print(f"\n✅  Model saved to: {PKL_PATH}")

# Quick verify
with open(PKL_PATH, "rb") as f:
    loaded = pickle.load(f)
print(f"Model type : {type(loaded['model']).__name__}")
print(f"Features   : {loaded['features']}")
print(f"Accuracy   : {loaded['accuracy']:.2f}%")
