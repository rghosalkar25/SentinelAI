import { ClipboardPaste, Eraser, ImageUp, ScanSearch, Loader2 } from "lucide-react";

const MAX_CHARS = 3000;

export default function ScanInput({ text, setText, onScan, isScanning }) {
  const charCount = text.length;
  const overLimit = charCount > MAX_CHARS;

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText((prev) => (prev + clipboardText).slice(0, MAX_CHARS));
    } catch {
      // Clipboard access denied/unavailable — fail silently, user can paste manually
    }
  };

  return (
    <div className="glass rounded-3xl p-6 sm:p-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">Scan a Message</h2>
        <span className={`font-mono text-xs ${overLimit ? "text-critical" : "text-white/40"}`}>
          {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
        </span>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste an SMS, email, or DM here to check it for phishing, scams, and other threats..."
        rows={8}
        className="w-full resize-none rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/90 placeholder:text-white/30 focus:border-brand-indigo/60 focus:outline-none focus:ring-2 focus:ring-brand-indigo/20"
      />

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          onClick={onScan}
          disabled={!text.trim() || overLimit || isScanning}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-blue via-brand-indigo to-brand-purple px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_30px_-10px_rgba(109,91,255,0.8)] transition disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isScanning ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Scanning...
            </>
          ) : (
            <>
              <ScanSearch className="h-4 w-4" /> Scan Message
            </>
          )}
        </button>

        <button
          onClick={handlePaste}
          className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/5"
        >
          <ClipboardPaste className="h-4 w-4" /> Paste
        </button>

        <button
          onClick={() => setText("")}
          className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/5"
        >
          <Eraser className="h-4 w-4" /> Clear
        </button>

        <button
          disabled
          title="Coming soon"
          className="ml-auto flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-white/30"
        >
          <ImageUp className="h-4 w-4" /> Upload Screenshot
        </button>
      </div>
    </div>
  );
}
