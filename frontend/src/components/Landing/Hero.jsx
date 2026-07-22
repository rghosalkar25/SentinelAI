import { ShieldCheck, ArrowRight, Radar } from "lucide-react";
import CyberBackground from "./CyberBackground.jsx";

export default function Hero({ onStartScanning }) {
  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden">
      <CyberBackground />

      {/* Nav */}
      <header className="relative z-10 flex items-center justify-between px-6 py-6 sm:px-10">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-blue to-brand-purple">
            <ShieldCheck className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display text-lg font-semibold tracking-tight">SentinelAI</span>
        </div>
        <button
          onClick={onStartScanning}
          className="glass rounded-full px-5 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10"
        >
          Open Dashboard
        </button>
      </header>

      {/* Hero content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="glass animate-fade-up mb-6 flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-white/70">
          <Radar className="h-3.5 w-3.5 text-brand-indigo" />
          Real-time NLP threat scanning
        </div>

        <h1
          className="animate-fade-up font-display text-5xl font-bold tracking-tight sm:text-7xl"
          style={{ animationDelay: "0.08s" }}
        >
          <span className="gradient-text">SentinelAI</span>
        </h1>

        <p
          className="animate-fade-up mt-5 max-w-xl text-balance text-lg text-white/60 sm:text-xl"
          style={{ animationDelay: "0.16s" }}
        >
          Intelligent NLP-Based Cyber Threat Detection Platform
        </p>

        <p
          className="animate-fade-up mt-3 max-w-md text-sm text-white/40"
          style={{ animationDelay: "0.22s" }}
        >
          Paste any message and get an instant read on phishing, scams, OTP fraud, and more — before you click, reply, or share.
        </p>

        <button
          onClick={onStartScanning}
          className="animate-fade-up group mt-10 flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-blue via-brand-indigo to-brand-purple px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_40px_-8px_rgba(109,91,255,0.7)] transition hover:shadow-[0_0_50px_-4px_rgba(109,91,255,0.9)]"
          style={{ animationDelay: "0.3s" }}
        >
          Start Scanning
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </button>

        <div
          className="animate-fade-up mt-16 grid w-full max-w-2xl grid-cols-3 gap-4 text-center"
          style={{ animationDelay: "0.38s" }}
        >
          {[
            ["7", "Threat categories"],
            ["<1s", "Avg. scan time"],
            ["24/7", "Continuous monitoring"],
          ].map(([value, label]) => (
            <div key={label} className="glass rounded-2xl px-4 py-5">
              <div className="font-mono text-2xl font-semibold text-white">{value}</div>
              <div className="mt-1 text-xs text-white/45">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
