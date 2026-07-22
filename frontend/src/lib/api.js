// Render Backend URL
const API_BASE = "https://sentinelai-cg2m.onrender.com";

/**
 * Sends a message to the SentinelAI backend for analysis.
 */
export async function scanMessage(text) {
  const res = await fetch(`${API_BASE}/scan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || "Scan failed. Please try again.");
  }

  return await res.json();
}

/**
 * Fetch scan history.
 */
export async function getHistory(limit = 50) {
  const res = await fetch(`${API_BASE}/history?limit=${limit}`);

  if (!res.ok) {
    throw new Error("Could not load scan history.");
  }

  return await res.json();
}

/**
 * Fetch dashboard statistics.
 */
export async function getStats() {
  const res = await fetch(`${API_BASE}/stats`);

  if (!res.ok) {
    throw new Error("Could not load stats.");
  }

  return await res.json();
}