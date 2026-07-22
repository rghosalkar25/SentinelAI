export default function CyberBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Ambient gradient glow */}
      <div className="absolute left-1/2 top-0 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[radial-gradient(circle,rgba(109,91,255,0.25),transparent_70%)] blur-2xl" />
      <div className="absolute right-0 bottom-0 h-[500px] w-[500px] translate-x-1/4 translate-y-1/4 rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.18),transparent_70%)] blur-2xl" />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 60% 50% at 50% 30%, black 40%, transparent 90%)",
        }}
      />

      {/* Radar - the signature scan motif */}
      <div className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2">
        <div className="relative flex h-[560px] w-[560px] items-center justify-center">
          {[1, 2, 3].map((ring) => (
            <div
              key={ring}
              className="pulse-ring absolute rounded-full border border-brand-indigo/30"
              style={{
                width: `${ring * 160}px`,
                height: `${ring * 160}px`,
                animationDelay: `${ring * 0.9}s`,
              }}
            />
          ))}
          <div className="radar-sweep absolute h-full w-full rounded-full">
            <div
              className="absolute left-1/2 top-1/2 h-1/2 w-[2px] origin-top"
              style={{
                background: "linear-gradient(180deg, rgba(109,91,255,0.9), transparent)",
              }}
            />
          </div>
          <div className="h-3 w-3 rounded-full bg-brand-indigo shadow-[0_0_20px_6px_rgba(109,91,255,0.5)]" />
        </div>
      </div>
    </div>
  );
}
