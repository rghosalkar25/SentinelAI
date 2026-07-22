"""
SentinelAI backend - FastAPI entrypoint.

Handles:
- CORS
- Routing
- Validation
- Database
- Detection
"""

from typing import List

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from schemas import ScanRequest, ScanResponse, HistoryItem, StatsResponse
from detection import run_scan
import database

app = FastAPI(
    title="SentinelAI API",
    description="NLP-based cyber threat detection API",
    version="1.1.0",
)

# -----------------------------
# CORS Configuration
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://sentinel-ai-sand.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Startup
# -----------------------------
@app.on_event("startup")
def on_startup():
    database.init_db()


# -----------------------------
# Root
# -----------------------------
@app.get("/")
def root():
    return {"message": "SentinelAI API is running"}


# -----------------------------
# Health Check
# -----------------------------
@app.get("/health")
def health():
    return {"status": "ok"}


# -----------------------------
# Scan Endpoint
# -----------------------------
@app.post("/scan", response_model=ScanResponse)
def scan_message(payload: ScanRequest):
    result = run_scan(payload.text)
    database.save_scan(payload.text, result)
    return ScanResponse(**result)


# -----------------------------
# History Endpoint
# -----------------------------
@app.get("/history", response_model=List[HistoryItem])
def scan_history(limit: int = 50):
    return database.get_history(limit=limit)


# -----------------------------
# Statistics Endpoint
# -----------------------------
@app.get("/stats", response_model=StatsResponse)
def scan_stats():
    return database.get_stats()
