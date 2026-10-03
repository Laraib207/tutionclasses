"use client";

import { useState } from "react";
import { Student } from "@/lib/types";
import { fileToCompressedDataUrl } from "@/lib/storage";

export default function StudentForm({
  onAdd,
  onClose,
}: {
  onAdd: (s: Omit<Student, "id" | "createdAt">) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [batch, setBatch] = useState("");
  const [phone, setPhone] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [busy, setBusy] = useState(false);

  async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const url = await fileToCompressedDataUrl(file, 500, 0.75);
      setPhoto(url);
    } finally {
      setBusy(false);
    }
  }

  function submit() {
    if (!name.trim()) {
      alert("Please enter the student's name.");
      return;
    }
    onAdd({ name: name.trim(), batch: batch.trim(), phone, parentPhone, dob, address, photo });
    onClose();
  }

  const field = (
    label: string,
    value: string,
    setter: (v: string) => void,
    placeholder = "",
    type = "text"
  ) => (
    <div>
      <label className="text-xs font-semibold text-neutral-400">{label}</label>
      <input
        type={type}
        className="w-full mt-1 px-3 py-2 rounded-lg bg-ink border border-line text-sm focus:outline-none focus:border-gold"
        value={value}
        placeholder={placeholder}
        onChange={(e) => setter(e.target.value)}
      />
    </div>
  );

  return (
    <div className="bg-panel border border-line rounded-xl2 p-4 mb-5">
      <h2 className="font-semibold text-sm mb-3 text-goldLight">Add New Student</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {field("Full Name *", name, setName, "Student's full name")}
        {field("Batch / Course", batch, setBatch, "e.g. Spoken English - Batch A")}
        {field("Phone Number", phone, setPhone, "Student's phone")}
        {field("Parent's Phone Number", parentPhone, setParentPhone, "Parent / guardian phone")}
        {field("Date of Birth", dob, setDob, "", "date")}
        <div className="sm:col-span-1">
          <label className="text-xs font-semibold text-neutral-400">Student's Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhoto}
            className="w-full mt-1 text-xs text-neutral-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-gold file:text-ink file:text-xs file:font-bold"
          />
        </div>
        <div className="sm:col-span-2">
          {field("Address", address, setAddress, "optional")}
        </div>
      </div>
      {photo && (
        <img src={photo} alt="preview" className="w-14 h-14 rounded-lg object-cover border border-line mt-3" />
      )}
      <div className="flex gap-2 mt-4">
        <button
          onClick={submit}
          disabled={busy}
          className="bg-gold text-ink font-bold rounded-lg px-4 py-2 text-sm hover:brightness-110 disabled:opacity-50"
        >
          {busy ? "Processing photo..." : "Save Student"}
        </button>
        <button
          onClick={onClose}
          className="px-4 rounded-lg border border-line text-sm text-neutral-300 hover:bg-white/5"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
