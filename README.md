# SentinelAI — Intelligent NLP-Based Cyber Threat Detection Platform

## Structure
- `backend/` — FastAPI mock detection API
- `frontend/` — React + Vite + Tailwind v4 dashboard

## Run the backend
```
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
API will be live at http://127.0.0.1:8000 (docs at /docs).

## Run the frontend
```
cd frontend
npm install
npm run dev
```
App will be live at http://127.0.0.1:5173.

## Notes
- Detection logic in `backend/detection.py` is a mock, keyword/rule-based
  engine. It's structured so it can be swapped for a real Hugging Face
  Transformer model later without changing `main.py`'s routes or the
  response shape in `schemas.py`.
- Scan History and Statistics on the dashboard use sample data
  (`frontend/src/data/sampleHistory.js`) since there's no database yet.
- No auth, OCR, or deployment config included, per the brief.
