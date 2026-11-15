import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
        mono: [
          '"JetBrains Mono"',
          'GeistMono',
          'Menlo',
          'Monaco',
          'Consolas',
          '"Liberation Mono"',
          'monospace',
        ],
      },
      colors: {
        workbench: {
          bg: "#FAFAFA",
          card: "#FFFFFF",
          secondary: "#F4F4F5",
          border: "#E4E4E7",
        },
        model: {
          base: "#71717A",
          sft: "#2563EB",
          dpo: "#059669",
        },
        status: {
          pass: "#16A34A",
          fail: "#DC2626",
        },
      },
    },
  },
  plugins: [],
};
export default config;
