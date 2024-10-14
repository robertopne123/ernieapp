import { useRouter } from "next/router";

export const User = () => {
  const router = useRouter();

  const logout = () => {
    router.push("/login");
  };

  return (
    <div className="flex-row justify-center items-center gap-2 border-[1px] border-erniecream pl-1 py-1 pr-3 rounded-full group hover:rounded-l-none hover:rounded-t-[20px] hover:rounded-b-none relative hidden lg:flex">
      <img
        src={localStorage.getItem("avatar")}
        className="w-8 rounded-full "
      ></img>
      <img src="/left-arrow-cream.svg" className="-rotate-90 w-3"></img>
      <div className="absolute bg-erniemint border-[1px] border-erniecream top-10 flex-col right-[-1px] group-hover:flex hidden">
        <div className="py-2 px-4">
          <p className="font-circular text-erniecream font-[500] text-nowrap whitespace-nowrap">
            Logged in as:
            <br />
            {localStorage.getItem("companyname")}
          </p>
        </div>
        <div
          className="py-2 px-4 hover:bg-ernieteal cursor-pointer"
          onClick={(e) => {
            logout();
          }}
        >
          <p className="font-circular text-erniecream font-[500] text-nowrap whitespace-nowrap">
            Log Out
          </p>
        </div>
      </div>
    </div>
  );
};
