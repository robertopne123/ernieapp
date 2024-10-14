import "@/styles/globals.css";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import localFont from "next/font/local";

const circularstd = localFont({
  src: [
    {
      path: "../public/fonts/CircularStd-Book.otf",
      weight: "400",
    },
    {
      path: "../public/fonts/circular-std-medium-500.ttf",
      weight: "500",
    },
  ],
  variable: "--font-circularstd",
});

const circerounded = localFont({
  src: [
    {
      path: "../public/fonts/CirceRounded-Alt-Bold.otf",
      weight: "800",
    },
    {
      path: "../public/fonts/CirceRounded-Alt-ExtraBold.otf",
      weight: "900",
    },
  ],
  variable: "--font-circerounded",
});

export default function App({ Component, pageProps }) {
  if (process.env.NODE_ENV !== "production") {
    // Adds messages only in a dev environment
    loadDevMessages();
    loadErrorMessages();
  }

  return (
    <main className={`${circerounded.className} ${circularstd.className}`}>
      <Component {...pageProps} />
    </main>
  );
}
