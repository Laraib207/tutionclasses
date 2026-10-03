"use client";

import Logo from "./Logo";

export default function Header({ onSettings }: { onSettings: () => void }) {
  return (
    <header className="sticky top-0 z-20 bg-[#0c0d10] border-b border-line">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
        <Logo size={42} />
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-lg text-goldLight leading-tight truncate">@iBzA Tuition Class</h1>
          <p className="text-[10px] tracking-[3px] text-teal font-semibold">THELARAIB</p>
        </div>
        <button
          onClick={onSettings}
          className="text-xs font-semibold border border-gold/50 text-gold rounded-lg px-3 py-1.5 hover:bg-gold/10 transition"
        >
          Settings
        </button>
      </div>
    </header>
  );
}
