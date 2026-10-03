export interface Student {
  id: string;
  name: string;
  batch: string;
  phone?: string;
  parentPhone?: string;
  address?: string;
  dob?: string;
  photo?: string; // compressed base64 data URL
  createdAt: number;
}

export interface TestRecord {
  id: string;
  studentId: string;
  testName: string;
  date: string; // yyyy-mm-dd
  result: "pass" | "fail";
  photo?: string; // exam paper photo, base64 data URL
  certificateId?: string;
  status: "pending" | "accepted"; // every entry waits for your approval first
  createdAt: number;
}

export interface Settings {
  instituteName: string;
  tagline: string;
  signatoryName: string;
  signatoryTitle: string;
  phone: string;
  email: string;
  address: string;
}

export const DEFAULT_SETTINGS: Settings = {
  instituteName: "@iBzA Tuition Class",
  tagline: "THELARAIB",
  signatoryName: "Laraib",
  signatoryTitle: "Founder & Head Tutor",
  phone: "",
  email: "",
  address: "",
};
