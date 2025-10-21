/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          bg: "#0a0a0a",
          card: "#111213",
          border: "#1e1f22",
          text: "#e5e7eb",
          mute: "#9ca3af",
        },
      },
      borderRadius: { "2xl": "1rem" },
    },
  },
  plugins: [],
};
