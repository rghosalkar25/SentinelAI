import { ShieldAlert, ShieldCheck, Info, Lightbulb } from "lucide-react";
import { THREAT_META } from "../../data/sampleHistory.js";

const THREAT_LEVEL_STYLES = {
  Low: "text-safe bg-safe/10 border-safe/30",
  Medium: "text-spam bg-spam/10 border-spam/30",
  High: "text-scam bg-scam/10 border-scam/30",
  Critical: "text-critical bg-critical/10 border-critical/30",
};

function highlightText(text, highlightedWords) {
  if (!highlightedWords?.length) return text;
  const words = highlightedWords.map((h) => h.word).filter(Boolean);
  if (!words.length) return text;

  const pattern = new RegExp(`(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  const parts = text.split(pattern);

  return parts.map((part, i) =>
    words.some((w) => w.toLowerCase() === part.toLowerCase()) ? (
      <mark key={i} className="rounded bg-critical/25 px-0.5 text-critical">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function ScanResult({ result, scannedText, isScanning }) {
  if (isScanning) {
    return (
      <div className="glass relative h-full overflow-hidden rounded-3xl p-8">
        <div className="scan-line absolute left-0 right-0 h-24 bg-gradient-to-b from-transparent via-brand-indigo/15 to-transparent" />
        <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-white/50">
          <ShieldAlert className="h-8 w-8 animate-pulse text-brand-indigo" />
          <p className="font-mono text-sm">Analyzing message for threat patterns...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="glass flex h-full flex-col items-center justify-center gap-3 rounded-3xl p-8 text-center text-white/30">
        <ShieldCheck className="h-8 w-8" />
        <p className="text-sm">Scan results will appear here.</p>
      </div>
    );
  }

  const meta = THREAT_META[result.prediction] ?? THREAT_META.Safe;
  const levelStyle = THREAT_LEVEL_STYLES[result.threat_level] ?? THREAT_LEVEL_STYLES.Low;

  return (
    <div className="glass flex h-full flex-col rounded-3xl p-6 sm:p-8">
      <h2 className="font-display mb-5 text-lg font-semibold">Scan Result</h2>

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <span
          className="rounded-full px-4 py-1.5 text-sm font-semibold"
          style={{ color: meta.color, backgroundColor: meta.bg }}
        >
          {result.prediction}
        </span>
        <span className={`rounded-full border px-3 py-1 text-xs font-medium ${levelStyle}`}>
          {result.threat_level} risk
        </span>
      </div>

      <div className="mb-6">
        <div className="mb-1.5 flex items-center justify-between text-xs text-white/50">
          <span>Confidence</span>
          <span className="font-mono text-white/80">{result.confidence.toFixed(1)}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-blue to-brand-purple transition-all duration-700"
            style={{ width: `${result.confidence}%` }}
          />
        </div>
      </div>

      {scannedText && (
        <div className="mb-6 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-relaxed text-white/70">
          {highlightText(scannedText, result.highlighted_words)}
        </div>
      )}

      <div className="mb-6">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-white/40">
          <Info className="h-3.5 w-3.5" /> Why this verdict
        </div>
        <ul className="space-y-1.5">
          {result.reasons.map((reason, i) => (
            <li key={i} className="flex gap-2 text-sm text-white/70">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white/30" />
              {reason}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto rounded-2xl border border-brand-indigo/20 bg-brand-indigo/[0.06] p-4">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brand-indigo">
          <Lightbulb className="h-3.5 w-3.5" /> AI Recommendations
        </div>
        <ul className="space-y-1.5">
          {result.recommendations.map((rec, i) => (
            <li key={i} className="flex gap-2 text-sm text-white/70">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-indigo" />
              {rec}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
