"use client";

import { Student, TestRecord } from "@/lib/types";

export default function PendingApprovals({
  pending,
  students,
  onAccept,
  onReject,
}: {
  pending: TestRecord[];
  students: Record<string, Student>;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}) {
  if (pending.length === 0) return null;

  return (
    <div className="bg-panel border border-gold/40 rounded-xl2 p-4 mb-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-goldLight animate-pulse" />
        <h2 className="font-semibold text-sm text-goldLight">
          Pending Approval ({pending.length})
        </h2>
      </div>
      <p className="text-xs text-neutral-500 mb-3">
        Review each result before it's added to the student's record and becomes certificate-eligible.
      </p>
      <div className="space-y-2">
        {pending.map((t) => {
          const s = students[t.studentId];
          return (
            <div
              key={t.id}
              className="flex items-center gap-3 bg-ink border border-line rounded-lg px-3 py-2.5 flex-wrap"
            >
              {t.photo && (
                <img src={t.photo} alt="" className="w-10 h-10 rounded-md object-cover border border-line" />
              )}
              <div className="flex-1 min-w-[140px]">
                <div className="text-sm font-semibold">{s?.name || "Unknown student"}</div>
                <div className="text-xs text-neutral-500">
                  {t.testName} · {t.date}
                </div>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                  t.result === "pass" ? "bg-teal/20 text-teal" : "bg-red-500/20 text-red-400"
                }`}
              >
                {t.result === "pass" ? "PASS" : "FAIL"}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => onAccept(t.id)}
                  className="text-xs font-bold bg-gold text-ink rounded-md px-3 py-1.5 hover:brightness-110"
                >
                  Accept
                </button>
                <button
                  onClick={() => onReject(t.id)}
                  className="text-xs font-semibold border border-line text-neutral-400 rounded-md px-3 py-1.5 hover:bg-white/5"
                >
                  Reject
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
