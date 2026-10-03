import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111216",
        panel: "#17181d",
        paper: "#faf8f2",
        gold: "#d8a934",
        goldLight: "#f2bb4a",
        teal: "#2f9a84",
        line: "#2a2b30",
        lineLight: "#e6dfc9",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        script: ["var(--font-script)"],
      },
      borderRadius: {
        xl2: "1.1rem",
      },
    },
  },
  plugins: [],
};
export default config;
