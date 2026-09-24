# CardioML Dashboard

A full-stack cardiovascular disease risk prediction dashboard built with **React (Vite)** on the frontend and **FastAPI** on the backend, powered by a **GradientBoosting** ML model trained on 68,000+ patient records.

## Features
- 🫀 CVD risk prediction using a real trained ML model (73.9% accuracy)
- 📊 Model evaluation dashboard with metrics, confusion matrix & feature importance
- 👤 Patient directory
- 🔄 Graceful fallback to client-side inference if backend is offline

## Tech Stack
| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite + Lucide Icons |
| Backend | FastAPI + Uvicorn |
| ML | scikit-learn GradientBoostingClassifier |
| Data | Cardiovascular Disease Dataset (Kaggle) |

## Getting Started

### Backend
```bash
cd backend
pip install -r requirements.txt
python train_and_save_model.py   # trains & saves best_cardio_model.pkl
python -m uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** — the frontend calls the API at `http://localhost:8000`.

## API Endpoints
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/predict` | Returns CVD risk score |
| GET | `/model-info` | Model metadata |
| GET | `/health` | Health check |
