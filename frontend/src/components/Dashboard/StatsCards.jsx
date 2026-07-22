import { useEffect, useState } from "react";
import { ScanLine, TriangleAlert, ShieldCheck, Flame } from "lucide-react";

function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start = null;
    let frame;

    const step = (timestamp) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}

function StatCard({ icon: Icon, label, value, accent }) {
  const animated = useCountUp(value);
  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-3 flex items-center justify-between">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg"
          style={{ backgroundColor: accent.bg, color: accent.color }}
        >
          <Icon className="h-4 w-4" strokeWidth={2.2} />
        </div>
      </div>
      <div className="font-mono text-2xl font-semibold text-white">{animated.toLocaleString()}</div>
      <div className="mt-1 text-xs text-white/45">{label}</div>
    </div>
  );
}

export default function StatsCards({ stats }) {
  const cards = [
    { icon: ScanLine, label: "Total Scans", value: stats.totalScans, accent: { color: "#4f7cff", bg: "rgba(79,124,255,0.12)" } },
    { icon: TriangleAlert, label: "Spam Detected", value: stats.spamDetected, accent: { color: "#f5b93f", bg: "rgba(245,185,63,0.12)" } },
    { icon: ShieldCheck, label: "Safe Messages", value: stats.safeMessages, accent: { color: "#22d3a8", bg: "rgba(34,211,168,0.12)" } },
    { icon: Flame, label: "High Risk Messages", value: stats.highRisk, accent: { color: "#ff3355", bg: "rgba(255,51,85,0.14)" } },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((c) => (
        <StatCard key={c.label} {...c} />
      ))}
    </div>
  );
}
