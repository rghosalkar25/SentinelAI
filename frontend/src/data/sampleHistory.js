// Sample data for the Scan History table and Statistics cards.
// Swap this for real persisted scans once a database is introduced.

export const THREAT_META = {
  Safe: { color: "#22d3a8", bg: "rgba(34,211,168,0.12)" },
  Spam: { color: "#f5b93f", bg: "rgba(245,185,63,0.12)" },
  "Fake Job Offer": { color: "#f5b93f", bg: "rgba(245,185,63,0.12)" },
  Scam: { color: "#ff8a4c", bg: "rgba(255,138,76,0.12)" },
  "Investment Scam": { color: "#ff8a4c", bg: "rgba(255,138,76,0.12)" },
  Phishing: { color: "#ff5c7a", bg: "rgba(255,92,122,0.12)" },
  "OTP Scam": { color: "#ff3355", bg: "rgba(255,51,85,0.14)" },
};

export const SAMPLE_HISTORY = [
  {
    id: "SCN-10231",
    snippet: "Your OTP is 483920. Do not share this code with anyone, including bank staff.",
    prediction: "OTP Scam",
    confidence: 91,
    threatLevel: "Critical",
    date: "2026-07-20 14:32",
  },
  {
    id: "SCN-10230",
    snippet: "Congratulations! You've won a $1000 gift card. Click here to claim now.",
    prediction: "Scam",
    confidence: 87,
    threatLevel: "High",
    date: "2026-07-20 11:05",
  },
  {
    id: "SCN-10229",
    snippet: "Hey, are we still on for dinner tonight at 7?",
    prediction: "Safe",
    confidence: 96,
    threatLevel: "Low",
    date: "2026-07-19 19:41",
  },
  {
    id: "SCN-10228",
    snippet: "Your account has been suspended. Verify your identity at secure-login-update.com",
    prediction: "Phishing",
    confidence: 94,
    threatLevel: "Critical",
    date: "2026-07-19 09:12",
  },
  {
    id: "SCN-10227",
    snippet: "Earn $500/day from home, no experience required. Pay a small registration fee to start.",
    prediction: "Fake Job Offer",
    confidence: 83,
    threatLevel: "Medium",
    date: "2026-07-18 16:50",
  },
  {
    id: "SCN-10226",
    snippet: "Double your investment in 24 hours with our guaranteed crypto trading bot.",
    prediction: "Investment Scam",
    confidence: 89,
    threatLevel: "High",
    date: "2026-07-18 08:22",
  },
  {
    id: "SCN-10225",
    snippet: "Flash sale! 70% off everything, today only. Unsubscribe anytime.",
    prediction: "Spam",
    confidence: 78,
    threatLevel: "Medium",
    date: "2026-07-17 12:03",
  },
  {
    id: "SCN-10224",
    snippet: "Reminder: your dentist appointment is tomorrow at 10am.",
    prediction: "Safe",
    confidence: 98,
    threatLevel: "Low",
    date: "2026-07-17 07:15",
  },
];

export const SAMPLE_STATS = {
  totalScans: 10231,
  spamDetected: 3894,
  safeMessages: 5602,
  highRisk: 735,
};
