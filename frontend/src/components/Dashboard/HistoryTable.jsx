import { THREAT_META } from "../../data/sampleHistory.js";

const LEVEL_DOT = {
  Low: "bg-safe",
  Medium: "bg-spam",
  High: "bg-scam",
  Critical: "bg-critical",
};

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function HistoryTable({ history }) {
  return (
    <div className="glass rounded-3xl p-6 sm:p-8">
      <h2 className="font-display mb-5 text-lg font-semibold">Scan History</h2>

      {history.length === 0 ? (
        <p className="py-8 text-center text-sm text-white/40">
          No scans yet — run a scan above and it'll show up here.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-white/40">
                <th className="pb-3 pr-4 font-medium">Scan ID</th>
                <th className="pb-3 pr-4 font-medium">Message</th>
                <th className="pb-3 pr-4 font-medium">Prediction</th>
                <th className="pb-3 pr-4 font-medium">Confidence</th>
                <th className="pb-3 pr-4 font-medium">Threat Level</th>
                <th className="pb-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {history.map((row) => {
                const meta = THREAT_META[row.prediction] ?? THREAT_META.Safe;
                return (
                  <tr key={row.id} className="border-b border-white/5 last:border-0">
                    <td className="py-3 pr-4 font-mono text-xs text-white/40">
                      SCN-{String(row.id).padStart(5, "0")}
                    </td>
                    <td className="max-w-[280px] truncate py-3 pr-4 text-white/70">{row.message}</td>
                    <td className="py-3 pr-4">
                      <span
                        className="rounded-full px-2.5 py-1 text-xs font-medium"
                        style={{ color: meta.color, backgroundColor: meta.bg }}
                      >
                        {row.prediction}
                      </span>
                    </td>
                    <td className="py-3 pr-4 font-mono text-white/70">{row.confidence}%</td>
                    <td className="py-3 pr-4">
                      <span className="flex items-center gap-1.5 text-white/70">
                        <span className={`h-1.5 w-1.5 rounded-full ${LEVEL_DOT[row.threat_level]}`} />
                        {row.threat_level}
                      </span>
                    </td>
                    <td className="py-3 font-mono text-xs text-white/40">{formatDate(row.created_at)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
