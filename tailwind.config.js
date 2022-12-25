/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      zIndex: {
        1000: "1000",
      },
    },
    screens: {
      xl: { max: "1279px" },
      // => @media (max-width: 1279px) { ... }

      lg: { max: "1023px" },
      // => @media (max-width: 1023px) { ... }

      md: { max: "767px" },
      // => @media (max-width: 767px) { ... }

      sm: { max: "639px" },
      // => @media (max-width: 639px) { ... }
    },
    colors: {
      white: "#fff",
      gray: "#C2C2C2",
      red: "#E63946",
      "blue-10": "#CDEAEB",
      "blue-20": "#F1FAEE",
      "blue-50": "#A8DADC",
      "blue-90": "#457B9D",
      blue: "#1D3557",
      green: "#37E69D",
      orange: "#E69D37",
    },
  },
  daisyui: {
    themes: [
      {
        theme: {
          primary: "#457B9D",
          secondary: "#F000B8",
          accent: "#37CDBE",
          neutral: "#3D4451",
          "base-100": "#FFFFFF",
          info: "#3ABFF8",
          success: "#36D399",
          warning: "#FBBD23",
          error: "#F87272",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
