/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#7A6BFF",
          dark: "#6556E0",
          light: "#EEECFF",
        },
        dark: "#2C3E50",
        bg: "#F4F5F9",
        "outer-bg": "#E8EAF6",
        muted: "#888888",
        success: "#27AE60",
        "success-bg": "#C6F6D5",
        danger: "#E74C3C",
        "danger-bg": "#FED7D7",
        warning: "#F39C12",
        "warning-bg": "#FEEBC8",
        info: "#3182CE",
        "info-bg": "#BEE3F8",
        border: "#E8EBF0",
      },
      borderRadius: {
        lg: "16px",
        xl: "24px",
      },
      boxShadow: {
        card: "0 4px 16px rgba(0,0,0,0.05)",
      },
    },
  },
  plugins: [],
}
