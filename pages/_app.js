import "@/styles/globals.css";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";

export default function App({ Component, pageProps }) {
  if (process.env.NODE_ENV !== "production") {
    // Adds messages only in a dev environment
    loadDevMessages();
    loadErrorMessages();
  }

  return <Component {...pageProps} />;
}
