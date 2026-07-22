const API_BASE = "http://127.0.0.1:8001";

/**
 * Sends a message to the SentinelAI backend for analysis.
 * Throws on network failure or non-2xx response.
 */
export async function scanMessage(text) {
  const res = await fetch(`${API_BASE}/scan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || "Scan failed. Please try again.");
  }

  return res.json();
}

/** Fetches recent scan history from the database. */
export async function getHistory(limit = 50) {
  const res = await fetch(`${API_BASE}/history?limit=${limit}`);
  if (!res.ok) throw new Error("Could not load scan history.");
  return res.json();
}

/** Fetches aggregate stats (total scans, spam detected, etc). */
export async function getStats() {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) throw new Error("Could not load stats.");
  return res.json();
}
