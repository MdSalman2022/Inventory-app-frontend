/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#2E3E64",

          secondary: "#cc4174",

          accent: "#6a77c9",

          neutral: "#221424",

          "base-100": "#F5F7FF",

          info: "#007bff",

          success: "#1d8c5f",

          warning: "#f2b23a",

          error: "#f83a25",
        },
      },
    ],
  },
  plugins: [require("daisyui"), require("prettier-plugin-tailwindcss")],
};
