import { useRouter } from "next/router";

export default function About({ backAction }) {
  const router = useRouter();

  const logout = () => {
    router.push("/login");
  };

  return (
    <div className="flex flex-col flex-grow pt-12 gap-4 h-full bg-erniecream">
      <div
        className="absolute top-0 left-0 p-6 bg-erniemint w-full"
        onClick={backAction}
      >
        <img src="/left-arrow.svg" className="w-6"></img>
      </div>
      <div className="flex flex-col gap-4 px-4 pt-8 justify-between flex-grow pb-8">
        <div className="flex flex-col gap-2">
          <p className="uppercase font-circe font-[900] text-4xl text-erniegreen mt-6">
            About
          </p>
          <p className="font-circular text-erniegreen font-[500]">
            Welcome to the Ernie London App
          </p>
          <p className="font-circular text-erniegreen font-[500] pb-3">
            Version {process.env.NEXT_PUBLIC_APP_VERSION}
          </p>
          <div
            className="bg-erniegreen w-full px-4 py-6"
            onClick={() => {
              logout();
            }}
          >
            <p className="font-circe text-erniecream font-[900] uppercase text-center text-xl">
              Log Out
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <img src="/dolcearch.svg" className="w-10"></img>
          <p className="font-circular text-erniegreen font-[500] text-sm">
            The Ernie App was designed, developed and is maintained by
            We&apos;re Digital Ltd t/a Dolce Studios. 2024 Ernie London Ltd
          </p>
        </div>
      </div>
    </div>
  );
}
