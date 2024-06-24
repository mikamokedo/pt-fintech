/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "blue",
        secondary: {
          100: "green",
          200: "#888883",
        },
      },
    },
  },
  plugins: [],
};
