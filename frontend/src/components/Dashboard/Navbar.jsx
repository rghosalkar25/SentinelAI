import { ShieldCheck, ArrowLeft } from "lucide-react";

export default function Navbar({ onBackHome }) {
  return (
    <header className="glass sticky top-0 z-20 flex items-center justify-between px-6 py-4 sm:px-10">
      <div className="flex items-center gap-3">
        <button
          onClick={onBackHome}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-white/50 transition hover:bg-white/10 hover:text-white"
          aria-label="Back to home"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-blue to-brand-purple">
          <ShieldCheck className="h-4 w-4 text-white" strokeWidth={2.5} />
        </div>
        <span className="font-display text-base font-semibold tracking-tight">SentinelAI Dashboard</span>
      </div>

      <div className="flex items-center gap-2 rounded-full bg-safe/10 px-3 py-1.5 text-xs font-medium text-safe">
        <span className="h-1.5 w-1.5 rounded-full bg-safe shadow-[0_0_8px_2px_rgba(34,211,168,0.6)]" />
        System Online
      </div>
    </header>
  );
}
