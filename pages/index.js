import Image from "next/image";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

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

export default function Home() {
  const router = useRouter();

  // useEffect(() => {
  //   setInterval(() => {
  //     router.push("/login");
  //   }, 3000);
  // }, []);

  return (
    <div className="flex min-h-screen bg-ernieteal relative">
      <div className="liquidernie w-24 h-24 mx-auto my-auto relative flex flex-row"></div>
    </div>
  );
}
