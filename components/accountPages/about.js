import { useRouter } from "next/router";
import Image from "next/image";

export default function About({ backAction }) {
  const router = useRouter();

  const logout = () => {
    router.push("/login");
  };

  return (
    <div className="flex flex-col flex-grow gap-6 h-full bg-erniedarkcream px-6">
      <div
        className="py-2 flex flex-row items-center gap-1 border-b-[1px] border-erniegreen cursor-pointer"
        onClick={backAction}
      >
        <div className="h-3 w-3 relative">
          <Image src="/left-arrow.svg" fill={true} className="h-6"></Image>
        </div>
        <p className="font-circular font-[500] text-center text-sm text-erniegreen">
          Back
        </p>
      </div>
      <div className="flex flex-col gap-6 flex-grow">
        <div className="rounded-xl bg-erniecream p-6">
          <p className="font-circe font-[900] text-xl text-erniegreen uppercase">
            About
          </p>
          <img src="/divider.png" className="w-full"></img>
          <p className="font-circular text-sm text-erniegreen font-[500] mt-4">
            Welcome to the Ernie London App
          </p>
          <p className="font-circular text-sm text-erniegreen font-[400] mt-2">
            We deliver locally roasted, specialty coffee and office pantry
            goodies via cargo bikes with zero reusable, recyclable packaging
            exclusively in London.
          </p>
          <p className="font-circular text-sm text-erniegreen font-[500] mt-2">
            Contact us:{" "}
            <a className="text-ernieteal" href="mailto:hello@ernie.london">
              hello@ernie.london
            </a>
          </p>
          <p className="font-circular text-sm text-erniegreen italic mt-2">
            <span className="font-[500]">App Version: </span>
            {process.env.NEXT_PUBLIC_APP_VERSION}
          </p>
          <p className="font-circular text-sm text-erniegreen italic">
            <span className="font-[500]">Build Number: </span>
            {process.env.NEXT_PUBLIC_BUILD_NUMBER}
          </p>
          <p className="font-circular text-sm text-erniegreen font-[500] mt-2">
            © 2024 Ernie London Ltd
          </p>
        </div>
        <div
          className="bg-erniegold px-4 py-2 rounded-lg cursor-pointer"
          onClick={() => {
            logout();
          }}
        >
          <p className="font-circe text-erniegreen font-[900] text-xl text-center">
            Log Out
          </p>
        </div>
        <div className="rounded-xl bg-erniecream p-6 flex flex-col gap-3">
          <img src="/dolcearch.svg" className="w-8"></img>
          <p className="font-circular text-erniegreen font-[500] text-sm">
            The Ernie App was designed, developed and is maintained by Dolce
            Studios.
          </p>
        </div>
      </div>
    </div>
  );
}
