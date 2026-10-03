"use client";

import { useState } from "react";
import { Student, TestRecord, Settings } from "@/lib/types";
import { fileToCompressedDataUrl } from "@/lib/storage";
import { generateCertificate } from "@/lib/certificate";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

export default function StudentCard({
  student,
  tests,
  settings,
  onAddTest,
  onDeleteStudent,
  onDeleteTest,
}: {
  student: Student;
  tests: TestRecord[]; // accepted tests only, newest first
  settings: Settings;
  onAddTest: (data: Omit<TestRecord, "id" | "createdAt" | "status">) => void;
  onDeleteStudent: (id: string) => void;
  onDeleteTest: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [testName, setTestName] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [result, setResult] = useState<"pass" | "fail">("pass");
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [busy, setBusy] = useState(false);
  const [certBusy, setCertBusy] = useState<string | null>(null);

  async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const url = await fileToCompressedDataUrl(file, 1000, 0.7);
      setPhoto(url);
    } finally {
      setBusy(false);
    }
  }

  function submitTest() {
    if (!testName.trim() || !date) {
      alert("Please enter the test name and date.");
      return;
    }
    onAddTest({ studentId: student.id, testName: testName.trim(), date, result, photo });
    setTestName("");
    setPhoto(undefined);
  }

  async function downloadCert(test: TestRecord) {
    setCertBusy(test.id);
    try {
      const { blob } = await generateCertificate(student, test, settings);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${student.name.replace(/[^a-z0-9]/gi, "_")}_certificate.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("Could not generate certificate. Please try again.");
    } finally {
      setCertBusy(null);
    }
  }

  return (
    <div className="bg-panel border border-line rounded-xl2 overflow-hidden mb-3">
      <div
        className="flex items-center gap-3 p-4 cursor-pointer"
        onClick={() => setOpen((o) => !o)}
      >
        {student.photo ? (
          <img src={student.photo} alt="" className="w-11 h-11 rounded-full object-cover border border-line" />
        ) : (
          <div className="w-11 h-11 rounded-full bg-gold/20 text-gold font-bold flex items-center justify-center text-sm">
            {initials(student.name)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm truncate">{student.name}</div>
          <div className="text-xs text-neutral-500 truncate">{student.batch || "No batch set"}</div>
        </div>
        <span className="text-xs text-neutral-500">{open ? "▲" : "▼"}</span>
      </div>

      {open && (
        <div className="border-t border-line p-4 pt-3">
          {(student.phone || student.parentPhone || student.dob || student.address) && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-neutral-400 mb-4">
              {student.phone && <div>📞 {student.phone}</div>}
              {student.parentPhone && <div>👪 {student.parentPhone}</div>}
              {student.dob && <div>🎂 {new Date(student.dob).toLocaleDateString("en-IN")}</div>}
              {student.address && <div className="col-span-2">📍 {student.address}</div>}
            </div>
          )}

          <div className="bg-ink border border-line rounded-lg p-3 mb-4">
            <div className="text-xs font-semibold text-neutral-400 mb-2">Add Test Result</div>
            <div className="grid grid-cols-2 gap-2">
              <input
                className="col-span-2 px-2.5 py-1.5 rounded-md bg-panel border border-line text-sm"
                placeholder="Test name"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
              />
              <input
                type="date"
                className="px-2.5 py-1.5 rounded-md bg-panel border border-line text-sm"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <select
                className="px-2.5 py-1.5 rounded-md bg-panel border border-line text-sm"
                value={result}
                onChange={(e) => setResult(e.target.value as "pass" | "fail")}
              >
                <option value="pass">Pass</option>
                <option value="fail">Fail</option>
              </select>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhoto}
                className="col-span-2 text-xs text-neutral-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:bg-gold file:text-ink file:text-xs file:font-bold"
              />
            </div>
            <button
              onClick={submitTest}
              disabled={busy}
              className="mt-2 w-full bg-gold text-ink font-bold rounded-md py-1.5 text-xs hover:brightness-110 disabled:opacity-50"
            >
              {busy ? "Processing photo..." : "Submit for Approval"}
            </button>
            <p className="text-[10px] text-neutral-500 mt-1.5">
              This goes to Pending Approval first — it won't show here until you accept it.
            </p>
          </div>

          {tests.length === 0 ? (
            <div className="text-xs text-neutral-500 text-center py-3">No accepted test records yet.</div>
          ) : (
            <div className="space-y-2">
              {tests.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center gap-2.5 border-t border-line pt-2.5 flex-wrap"
                >
                  {t.photo && (
                    <img src={t.photo} alt="" className="w-9 h-9 rounded-md object-cover border border-line" />
                  )}
                  <div className="flex-1 min-w-[120px]">
                    <div className="text-sm font-medium">{t.testName}</div>
                    <div className="text-xs text-neutral-500">{t.date}</div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                      t.result === "pass" ? "bg-teal/20 text-teal" : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {t.result === "pass" ? "PASS" : "FAIL"}
                  </span>
                  {t.result === "pass" && (
                    <button
                      onClick={() => downloadCert(t)}
                      disabled={certBusy === t.id}
                      className="text-xs font-semibold border border-gold/50 text-gold rounded-md px-2.5 py-1 hover:bg-gold/10 disabled:opacity-50"
                    >
                      {certBusy === t.id ? "Generating..." : "🏆 Certificate"}
                    </button>
                  )}
                  <button
                    onClick={() => onDeleteTest(t.id)}
                    className="text-xs text-neutral-500 hover:text-red-400 px-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => onDeleteStudent(student.id)}
            className="mt-4 text-xs text-red-400/80 hover:text-red-400"
          >
            Remove student
          </button>
        </div>
      )}
    </div>
  );
}
