/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        welcomescreen: "url(/welcomescreen.jpg)",
        loginscreen: "url(/loginscreen.jpg)",
      },
      colors: {
        erniecream: "#FFFFEC",
        ernieteal: "#44B69C",
        ernieyellow: "#FFDB65",
        erniemint: "#8FD3C4",
        erniegreen: "#004A40",
        erniegold: "#F8A740",
        erniedarkcream: "#E4E4C4",
        erniecreamshadow: "#929277",
      },
      fontFamily: {
        circular: ["var(--font-circularstd)"],
        circe: ["var(--font-circerounded)"],
      },
      maxHeight: {
        ios: "calc(88vh - 34px - 59px)",
        pdf: "calc(88vh - 34px - 59px - 72px)",
        pdfinner: "calc(88vh - 34px - 59px - 72px - 56px)",
      },
      screens: {
        smmb: "350px",
        mdmb: "390px",
        lgmb: "430px",
        xlmb: "460px",
      },
    },
  },
  plugins: [],
};
