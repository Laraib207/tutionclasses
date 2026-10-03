"use client";

import { useState } from "react";
import { Settings } from "@/lib/types";

export default function SettingsPanel({
  settings,
  onSave,
  onClose,
}: {
  settings: Settings;
  onSave: (s: Settings) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Settings>(settings);

  function field(key: keyof Settings, label: string, placeholder = "") {
    return (
      <div className="mb-3">
        <label className="text-xs font-semibold text-neutral-400">{label}</label>
        <input
          className="w-full mt-1 px-3 py-2 rounded-lg bg-ink border border-line text-sm focus:outline-none focus:border-gold"
          value={form[key] as string}
          placeholder={placeholder}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-30 bg-black/60 flex items-start sm:items-center justify-center p-4 overflow-y-auto">
      <div className="bg-panel border border-line rounded-xl2 w-full max-w-md p-5 my-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl text-goldLight">Institute Settings</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-white text-xl leading-none">
            ×
          </button>
        </div>
        <p className="text-xs text-neutral-500 mb-4">
          These details appear on every certificate you generate — your signature name is rendered in a
          stylised script automatically.
        </p>
        {field("instituteName", "Institute Name")}
        {field("tagline", "Tagline")}
        {field("signatoryName", "Your Name (for digital signature)")}
        {field("signatoryTitle", "Your Title", "e.g. Founder & Head Tutor")}
        {field("phone", "Contact Phone", "optional")}
        {field("email", "Contact Email", "optional")}
        {field("address", "Address", "optional")}
        <div className="flex gap-2 mt-5">
          <button
            onClick={() => {
              onSave(form);
              onClose();
            }}
            className="flex-1 bg-gold text-ink font-bold rounded-lg py-2.5 text-sm hover:brightness-110"
          >
            Save Settings
          </button>
          <button
            onClick={onClose}
            className="px-4 rounded-lg border border-line text-sm text-neutral-300 hover:bg-white/5"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
