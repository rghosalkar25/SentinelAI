"""
SentinelAI backend - FastAPI entrypoint.

Wires up HTTP concerns (CORS, routing, validation, persistence). Detection
logic lives in detection.py, persistence lives in database.py - both can be
swapped independently without touching this file's route contracts.
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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    database.init_db()


@app.get("/")
def root():
    return {"message": "SentinelAI API is running"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/scan", response_model=ScanResponse)
def scan_message(payload: ScanRequest) -> ScanResponse:
    result = run_scan(payload.text)
    database.save_scan(payload.text, result)
    return ScanResponse(**result)


@app.get("/history", response_model=List[HistoryItem])
def scan_history(limit: int = 50):
    return database.get_history(limit=limit)


@app.get("/stats", response_model=StatsResponse)
def scan_stats():
    return database.get_stats()
