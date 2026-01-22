export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        glass: "rgba(255,255,255,0.15)",
        glassBorder: "rgba(255,255,255,0.25)",
        primary: "#ff8a00",
        primaryDark: "#ff6a00",
        bgDark: "#0f172a",
        cardDark: "rgba(15,23,42,0.6)",
      },
      backdropBlur: {
        glass: "12px",
      },
      boxShadow: {
        glass:
          "0 8px 32px rgba(0,0,0,0.25)",
      },
    },
  },
  plugins: [],
};
