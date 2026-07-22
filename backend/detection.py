"""
Detection engine for SentinelAI.

Uses a real pretrained Hugging Face model (binary spam/ham) as the base
signal, blended with a keyword layer that narrows the result into
SentinelAI's 7 categories (the pretrained model only knows spam vs. not-spam,
so the keyword layer does the fine-grained categorization on top of it).

To upgrade further: fine-tune your own multi-class model on labeled data for
all 7 categories and swap out `run_model()` - everything downstream
(threat_level_for, extract_highlights, etc.) stays the same.
"""

import re
import logging
from typing import List, Tuple, Dict

from transformers import pipeline

logger = logging.getLogger("sentinelai")

# ---------------------------------------------------------------------------
# Real model: binary spam/ham classifier (loaded once at import time)
# ---------------------------------------------------------------------------

MODEL_NAME = "mrm8488/bert-tiny-finetuned-sms-spam-detection"

logger.info("Loading detection model: %s", MODEL_NAME)
_classifier = pipeline("text-classification", model=MODEL_NAME)
logger.info("Model loaded.")


def run_model(text: str) -> float:
    """Returns spam probability (0-1) from the pretrained model."""
    result = _classifier(text[:512])[0]  # model has a token limit; truncate long input
    label, score = result["label"], result["score"]
    return score if label == "LABEL_1" else 1 - score

# ---------------------------------------------------------------------------
# Category keyword banks - used to narrow "spam" into a specific category
# ---------------------------------------------------------------------------

CATEGORY_KEYWORDS: Dict[str, List[str]] = {
    "OTP Scam": [
        "otp", "one time password", "verification code", "do not share your code",
        "your code is", "confirm your otp",
    ],
    "Phishing": [
        "verify your account", "account suspended", "unusual activity", "confirm your identity",
        "click here to verify", "your account has been locked", "update your payment details",
        "security alert", "login to continue",
    ],
    "Investment Scam": [
        "guaranteed returns", "double your money", "crypto investment", "trading bot",
        "risk-free profit", "invest now", "earn daily returns", "forex signal",
    ],
    "Fake Job Offer": [
        "work from home", "earn per day", "no experience required", "hiring urgently",
        "registration fee", "part time job offer", "easy money", "data entry job",
    ],
    "Scam": [
        "wire transfer", "western union", "inheritance", "lottery winner", "customs fee",
        "processing fee", "claim your prize", "you have won",
    ],
    "Spam": [
        "buy now", "limited time offer", "act now", "discount", "unsubscribe",
        "congratulations", "free gift", "click here",
    ],
}

URL_RE = re.compile(r"https?://\S+|www\.\S+")
PHONE_RE = re.compile(r"\b(\+?\d[\d\-\s]{8,}\d)\b")
MONEY_RE = re.compile(r"[$£€₹]\s?\d|(?:\d+[.,]?\d*)\s?(?:usd|dollars|inr|rs\.?)\b", re.I)
URGENCY_RE = re.compile(r"\b(urgent|immediately|now|asap|final notice|last chance)\b", re.I)

THREAT_ORDER = ["Safe", "Spam", "Fake Job Offer", "Scam", "Investment Scam", "Phishing", "OTP Scam"]


def classify(text: str) -> Tuple[str, float, Dict[str, int]]:
    """
    Real classifier: model gives spam/ham probability, keyword layer picks
    which of the 7 categories best fits when the model says "spam".

    Returns: (prediction_label, confidence_0_to_100, category_hit_counts)
    """
    spam_prob = run_model(text)

    lower = text.lower()
    hits: Dict[str, int] = {}
    for category, keywords in CATEGORY_KEYWORDS.items():
        count = sum(1 for kw in keywords if kw in lower)
        if count:
            hits[category] = count

    has_url = bool(URL_RE.search(text))
    has_phone = bool(PHONE_RE.search(text))
    has_money = bool(MONEY_RE.search(text))
    has_urgency = bool(URGENCY_RE.search(lower))
    structural_signal = has_url or has_phone or has_money or has_urgency

    # Model says it's not spam, and no structural red flags -> trust it
    if spam_prob < 0.5 and not (hits or structural_signal):
        return "Safe", round((1 - spam_prob) * 100, 2), {}

    # Model or keyword/structural signals suggest something's off - pick the
    # most specific matching category, defaulting to generic "Spam"
    if hits:
        best_category = max(
            hits.keys(),
            key=lambda c: (hits[c], THREAT_ORDER.index(c) if c in THREAT_ORDER else 0),
        )
    else:
        best_category = "Spam"
        hits["Spam"] = 0

    # Blend model confidence with keyword signal strength for the final score
    signal_strength = hits.get(best_category, 0)
    boost = (5 if has_url else 0) + (5 if has_phone else 0) + (4 if has_money else 0) + (4 if has_urgency else 0)
    confidence = min(99, max(spam_prob * 100, 50) + signal_strength * 6 + boost * 0.6)

    return best_category, round(float(confidence), 2), hits


def threat_level_for(prediction: str, confidence: float) -> str:
    if prediction == "Safe":
        return "Low"
    if prediction in ("OTP Scam", "Phishing") and confidence >= 75:
        return "Critical"
    if prediction in ("OTP Scam", "Phishing", "Investment Scam"):
        return "High"
    if prediction in ("Scam", "Fake Job Offer"):
        return "Medium" if confidence < 80 else "High"
    return "Medium" if confidence >= 70 else "Low"


def extract_highlights(text: str, prediction: str, hits: Dict[str, int]) -> List[Dict[str, str]]:
    highlights = []
    lower = text.lower()

    if prediction != "Safe":
        for category, keywords in CATEGORY_KEYWORDS.items():
            for kw in keywords:
                if kw in lower:
                    highlights.append({"word": kw, "reason": f"Common phrase in {category.lower()} messages"})

    for match in URL_RE.finditer(text):
        highlights.append({"word": match.group(), "reason": "Suspicious or unverified link"})
    for match in PHONE_RE.finditer(text):
        highlights.append({"word": match.group().strip(), "reason": "Embedded phone number"})

    # de-dupe while preserving order, cap at 8 for UI readability
    seen = set()
    deduped = []
    for h in highlights:
        key = h["word"].lower()
        if key not in seen:
            seen.add(key)
            deduped.append(h)
    return deduped[:8]


def build_reasons(prediction: str, hits: Dict[str, int], has_url: bool, has_phone: bool, has_money: bool) -> List[str]:
    if prediction == "Safe":
        return ["No known threat patterns detected", "No suspicious links, numbers, or urgency language found"]

    reasons = [f"Matched {hits.get(prediction, 0)} phrase(s) commonly seen in {prediction.lower()} messages"]
    if has_url:
        reasons.append("Message contains a link, a common delivery method for scams")
    if has_phone:
        reasons.append("Message contains a phone number requesting contact or callback")
    if has_money:
        reasons.append("Message references money, payment, or a monetary amount")
    return reasons


RECOMMENDATIONS: Dict[str, List[str]] = {
    "Safe": [
        "No action needed.",
        "Still avoid sharing personal details with unknown senders.",
    ],
    "Spam": [
        "Do not click any links in this message.",
        "Mark as spam and block the sender.",
    ],
    "Phishing": [
        "Do not enter your credentials on any linked site.",
        "Verify the request directly with the organization using an official channel.",
        "Report this message to your IT/security team.",
    ],
    "Scam": [
        "Do not send money or personal information.",
        "Verify claims independently before taking any action.",
    ],
    "OTP Scam": [
        "Never share your OTP with anyone, including someone claiming to be support staff.",
        "Contact your bank or service provider directly using their official number.",
    ],
    "Fake Job Offer": [
        "Legitimate employers do not ask for a fee to register or interview.",
        "Verify the company through its official website and employee reviews.",
    ],
    "Investment Scam": [
        "Be skeptical of guaranteed or 'risk-free' returns; no legitimate investment guarantees profit.",
        "Verify the platform is registered with a recognized financial regulator before investing.",
    ],
}


def build_recommendations(prediction: str) -> List[str]:
    return RECOMMENDATIONS.get(prediction, RECOMMENDATIONS["Spam"])


def run_scan(text: str) -> dict:
    prediction, confidence, hits = classify(text)
    threat_level = threat_level_for(prediction, confidence)
    highlighted_words = extract_highlights(text, prediction, hits)
    reasons = build_reasons(
        prediction, hits,
        has_url=bool(URL_RE.search(text)),
        has_phone=bool(PHONE_RE.search(text)),
        has_money=bool(MONEY_RE.search(text)),
    )
    recommendations = build_recommendations(prediction)

    return {
        "prediction": prediction,
        "confidence": confidence,
        "threat_level": threat_level,
        "highlighted_words": highlighted_words,
        "reasons": reasons,
        "recommendations": recommendations,
    }
