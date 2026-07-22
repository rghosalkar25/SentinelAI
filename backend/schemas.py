"""
Pydantic request/response models for the SentinelAI API.

Keeping these separate from main.py means the response *shape* is stable
even when detection.py is swapped out for a real Transformer model later.
"""

from typing import List
from pydantic import BaseModel, Field


class ScanRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=8000, description="Message text to analyze")


class HighlightedWord(BaseModel):
    word: str
    reason: str


class ScanResponse(BaseModel):
    prediction: str            # Safe | Spam | Phishing | Scam | OTP Scam | Fake Job Offer | Investment Scam
    confidence: float          # 0-100
    threat_level: str          # Low | Medium | High | Critical
    highlighted_words: List[HighlightedWord]
    reasons: List[str]
    recommendations: List[str]


class HistoryItem(BaseModel):
    id: int
    message: str
    prediction: str
    confidence: float
    threat_level: str
    created_at: str


class StatsResponse(BaseModel):
    total_scans: int
    spam_detected: int
    safe_messages: int
    high_risk_messages: int
