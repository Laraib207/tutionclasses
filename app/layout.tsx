import type { Metadata } from "next";
import { Inter, Playfair_Display, Dancing_Script } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const script = Dancing_Script({ subsets: ["latin"], variable: "--font-script", display: "swap" });

export const metadata: Metadata = {
  title: "@iBzA Tuition Class — Student & Certificate Manager",
  description: "Manage students, test results and official certificates for @iBzA Tuition Class.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} ${script.variable} font-body bg-ink text-neutral-100`}>
        {children}
      </body>
    </html>
  );
}
