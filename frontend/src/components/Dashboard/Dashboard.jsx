import { useEffect, useState, useCallback } from "react";
import Navbar from "./Navbar.jsx";
import ScanInput from "./ScanInput.jsx";
import ScanResult from "./ScanResult.jsx";
import StatsCards from "./StatsCards.jsx";
import HistoryTable from "./HistoryTable.jsx";
import { scanMessage, getHistory, getStats } from "../../lib/api.js";

const EMPTY_STATS = { totalScans: 0, spamDetected: 0, safeMessages: 0, highRisk: 0 };

export default function Dashboard({ onBackHome }) {
  const [text, setText] = useState("");
  const [scannedText, setScannedText] = useState("");
  const [result, setResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState("");

  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(EMPTY_STATS);

  const refreshData = useCallback(async () => {
    try {
      const [historyData, statsData] = await Promise.all([getHistory(), getStats()]);
      setHistory(historyData);
      setStats({
        totalScans: statsData.total_scans,
        spamDetected: statsData.spam_detected,
        safeMessages: statsData.safe_messages,
        highRisk: statsData.high_risk_messages,
      });
    } catch {
      // Backend not reachable yet on initial load - dashboard still renders with empty state
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleScan = async () => {
    if (!text.trim()) return;
    setIsScanning(true);
    setError("");
    setResult(null);

    try {
      const data = await scanMessage(text);
      setScannedText(text);
      setResult(data);
      refreshData(); // pull in the newly saved scan + updated stats
    } catch (err) {
      setError(err.message || "Could not reach the SentinelAI backend. Is it running on port 8001?");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar onBackHome={onBackHome} />

      <main className="mx-auto max-w-7xl space-y-8 px-6 py-8 sm:px-10">
        <StatsCards stats={stats} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ScanInput text={text} setText={setText} onScan={handleScan} isScanning={isScanning} />
            {error && (
              <div className="mt-4 rounded-xl border border-critical/30 bg-critical/10 px-4 py-3 text-sm text-critical">
                {error}
              </div>
            )}
          </div>
          <div className="lg:col-span-2">
            <ScanResult result={result} scannedText={scannedText} isScanning={isScanning} />
          </div>
        </div>

        <HistoryTable history={history} />
      </main>
    </div>
  );
}
