"use client";

import { Student, TestRecord, Settings, DEFAULT_SETTINGS } from "./types";

const STUDENTS_KEY = "ibza_students_v1";
const TESTS_KEY = "ibza_tests_v1";
const SETTINGS_KEY = "ibza_settings_v1";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function newId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

// ---- Students ----
export function getStudents(): Student[] {
  return read<Student[]>(STUDENTS_KEY, []).sort((a, b) => a.createdAt - b.createdAt);
}

export function addStudent(data: Omit<Student, "id" | "createdAt">): Student {
  const students = getStudents();
  const student: Student = { ...data, id: newId(), createdAt: Date.now() };
  write(STUDENTS_KEY, [...students, student]);
  return student;
}

export function updateStudent(id: string, patch: Partial<Student>) {
  const students = getStudents().map((s) => (s.id === id ? { ...s, ...patch } : s));
  write(STUDENTS_KEY, students);
}

export function deleteStudent(id: string) {
  write(STUDENTS_KEY, getStudents().filter((s) => s.id !== id));
  write(TESTS_KEY, getTests().filter((t) => t.studentId !== id));
}

// ---- Tests ----
export function getTests(): TestRecord[] {
  return read<TestRecord[]>(TESTS_KEY, []);
}

export function getTestsForStudent(studentId: string): TestRecord[] {
  return getTests()
    .filter((t) => t.studentId === studentId)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export function addTest(data: Omit<TestRecord, "id" | "createdAt" | "status">): TestRecord {
  const tests = getTests();
  const test: TestRecord = { ...data, id: newId(), createdAt: Date.now(), status: "pending" };
  write(TESTS_KEY, [...tests, test]);
  return test;
}

export function deleteTest(id: string) {
  write(TESTS_KEY, getTests().filter((t) => t.id !== id));
}

export function acceptTest(id: string) {
  write(
    TESTS_KEY,
    getTests().map((t) => (t.id === id ? { ...t, status: "accepted" as const } : t))
  );
}

export function getPendingTests(): TestRecord[] {
  return getTests()
    .filter((t) => t.status === "pending")
    .sort((a, b) => b.createdAt - a.createdAt);
}

// ---- Settings ----
export function getSettings(): Settings {
  return read<Settings>(SETTINGS_KEY, DEFAULT_SETTINGS);
}

export function saveSettings(settings: Settings) {
  write(SETTINGS_KEY, settings);
}

// ---- Image helper: compress an uploaded file to a reasonable base64 ----
export function fileToCompressedDataUrl(file: File, maxWidth = 900, quality = 0.72): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Could not read image"));
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas not supported"));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
