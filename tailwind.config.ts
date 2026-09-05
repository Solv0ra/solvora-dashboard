export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0A0E1A",
        surface: "#111827",
        edge: "#1F2937",
        accent: "#6366F1",
        "accent-soft": "#818CF8",
        mint: "#34D399",
      },
    },
  },
  plugins: [],
};