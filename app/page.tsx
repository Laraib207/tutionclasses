"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import SettingsPanel from "@/components/SettingsPanel";
import StudentForm from "@/components/StudentForm";
import StudentCard from "@/components/StudentCard";
import PendingApprovals from "@/components/PendingApprovals";
import { Student, TestRecord, Settings, DEFAULT_SETTINGS } from "@/lib/types";
import {
  getStudents,
  addStudent,
  deleteStudent,
  getTests,
  addTest,
  deleteTest,
  acceptTest,
  getSettings,
  saveSettings,
} from "@/lib/storage";

export default function Home() {
  const [students, setStudents] = useState<Student[]>([]);
  const [tests, setTests] = useState<TestRecord[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [showSettings, setShowSettings] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [ready, setReady] = useState(false);

  function refresh() {
    setStudents(getStudents());
    setTests(getTests());
  }

  useEffect(() => {
    setSettings(getSettings());
    refresh();
    setReady(true);
  }, []);

  const studentMap = Object.fromEntries(students.map((s) => [s.id, s]));
  const pending = tests.filter((t) => t.status === "pending").sort((a, b) => b.createdAt - a.createdAt);

  if (!ready) return null;

  return (
    <div className="min-h-screen">
      <Header onSettings={() => setShowSettings(true)} />
      <main className="max-w-3xl mx-auto px-4 py-5">
        <PendingApprovals
          pending={pending}
          students={studentMap}
          onAccept={(id) => {
            acceptTest(id);
            refresh();
          }}
          onReject={(id) => {
            deleteTest(id);
            refresh();
          }}
        />

        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl text-goldLight">Students</h2>
          <button
            onClick={() => setShowAddStudent((v) => !v)}
            className="bg-gold text-ink font-bold rounded-lg px-3.5 py-2 text-xs hover:brightness-110"
          >
            + Add Student
          </button>
        </div>

        {showAddStudent && (
          <StudentForm
            onAdd={(data) => {
              addStudent(data);
              refresh();
            }}
            onClose={() => setShowAddStudent(false)}
          />
        )}

        {students.length === 0 ? (
          <div className="text-center text-neutral-500 text-sm py-16 border border-dashed border-line rounded-xl2">
            No students yet. Tap "+ Add Student" to create your first section.
          </div>
        ) : (
          students.map((s) => (
            <StudentCard
              key={s.id}
              student={s}
              settings={settings}
              tests={tests
                .filter((t) => t.studentId === s.id && t.status === "accepted")
                .sort((a, b) => b.createdAt - a.createdAt)}
              onAddTest={(data) => {
                addTest(data);
                refresh();
              }}
              onDeleteStudent={(id) => {
                deleteStudent(id);
                refresh();
              }}
              onDeleteTest={(id) => {
                deleteTest(id);
                refresh();
              }}
            />
          ))
        )}

        <p className="text-center text-[11px] text-neutral-600 mt-8">
          All data is stored securely in this browser only. Use the same browser & device each time.
        </p>
      </main>

      {showSettings && (
        <SettingsPanel
          settings={settings}
          onSave={(s) => {
            saveSettings(s);
            setSettings(s);
          }}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
