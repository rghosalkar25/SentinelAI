"""
SQLite persistence for SentinelAI.

Uses Python's built-in sqlite3 - no extra install, no server to run.
The database file (sentinelai.db) is created automatically on first run,
right next to this file.
"""

import sqlite3
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Dict, Optional

DB_PATH = Path(__file__).parent / "sentinelai.db"


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_connection()
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS scans (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            message TEXT NOT NULL,
            prediction TEXT NOT NULL,
            confidence REAL NOT NULL,
            threat_level TEXT NOT NULL,
            highlighted_words TEXT NOT NULL,
            reasons TEXT NOT NULL,
            recommendations TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
        """
    )
    conn.commit()
    conn.close()


def save_scan(message: str, result: dict) -> int:
    conn = get_connection()
    cursor = conn.execute(
        """
        INSERT INTO scans (message, prediction, confidence, threat_level, highlighted_words, reasons, recommendations, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            message,
            result["prediction"],
            result["confidence"],
            result["threat_level"],
            json.dumps(result["highlighted_words"]),
            json.dumps(result["reasons"]),
            json.dumps(result["recommendations"]),
            datetime.now(timezone.utc).isoformat(),
        ),
    )
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return new_id


def get_history(limit: int = 50) -> List[Dict]:
    conn = get_connection()
    rows = conn.execute(
        "SELECT * FROM scans ORDER BY id DESC LIMIT ?", (limit,)
    ).fetchall()
    conn.close()

    return [
        {
            "id": row["id"],
            "message": row["message"],
            "prediction": row["prediction"],
            "confidence": row["confidence"],
            "threat_level": row["threat_level"],
            "created_at": row["created_at"],
        }
        for row in rows
    ]


HIGH_RISK_LEVELS = ("High", "Critical")


def get_stats() -> Dict:
    conn = get_connection()
    total = conn.execute("SELECT COUNT(*) AS c FROM scans").fetchone()["c"]
    safe = conn.execute("SELECT COUNT(*) AS c FROM scans WHERE prediction = 'Safe'").fetchone()["c"]
    spam = conn.execute(
        "SELECT COUNT(*) AS c FROM scans WHERE prediction != 'Safe'"
    ).fetchone()["c"]
    high_risk = conn.execute(
        f"SELECT COUNT(*) AS c FROM scans WHERE threat_level IN {HIGH_RISK_LEVELS}"
    ).fetchone()["c"]
    conn.close()

    return {
        "total_scans": total,
        "spam_detected": spam,
        "safe_messages": safe,
        "high_risk_messages": high_risk,
    }
