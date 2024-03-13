import Image from "next/image";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import Link from "next/link";

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
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between bg-erniecream ${circularstd.variable} font-sans ${circerounded.variable} font-sans`}
    >
      <div className="lg:flex hidden text-erniegreen px-4">
        <p>Please use a mobile phone to view this page</p>
      </div>
      <div className="lg:hidden flex text-erniegreen relative w-full h-screen">
        <div className="bg-welcomescreen h-full w-full bg-cover bg-[center_center] px-8 pb-[66px] flex flex-col justify-end gap-4">
          <p className="font-circe font-[900] text-erniegreen uppercase text-5xl">
            SUSTAINABLE WORKPLACE COFFEE DELIVERY
          </p>
          <Link href="/login">
            <div className="bg-erniegold w-full h-16 flex flex-row p-4 justify-center items-center cursor-pointer">
              <p className="font-circe font-[900] text-erniegreen uppercase text-2xl mt-1">
                Get Started
              </p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
