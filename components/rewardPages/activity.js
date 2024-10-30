import Image from "next/image";

export const Activity = ({ backAction }) => {
  return (
    <div className="absolute top-0 left-0 z-10 bg-erniedarkcream h-full flex flex-col overflow-y-auto gap-6 pb-6 w-full px-6">
      <div
        className="py-2 lg:pt-10 flex flex-row items-center gap-1 border-b-[1px] border-erniegreen cursor-pointer"
        onClick={backAction}
      >
        <div className="h-3 w-3 lg:w-4 lg:h-4 relative">
          <Image src="/left-arrow.svg" fill={true} className="h-6"></Image>
        </div>
        <p className="font-circular font-[500] text-center text-sm text-erniegreen lg:text-base">
          Back
        </p>
      </div>
      <div className="bg-erniecream rounded-xl p-6">
        <p className="font-circe text-xl text-erniegreen font-[900] uppercase">
          My Activity
        </p>
        <img src="/divider.png" className=" w-full mt-2"></img>
        <div className="flex flex-row justify-between gap-4 mt-4 items-center">
          <img
            src="https://i0.wp.com/ernie.london/wp-content/uploads/2023/07/Asset-3-1.png?fit=630,790&ssl=1"
            className="w-16 h-16 min-w-[64px] object-contain"
          ></img>
          <div className="flex flex-col justify-center flex-grow">
            <div className="flex flex-row justify-between w-full">
              <p className="font-circe font-[900] uppercase text-erniegreen leading-[24px]">
                Purchase
              </p>
              <p className="font-circular font-[500] text-erniegreen opacity-50 text-sm">
                3h ago
              </p>
            </div>
            <div className="line-clamp-1">
              <p className="font-circular font-[500] text-erniegreen">
                1kg Ernie Swiss Water Decaf
              </p>
            </div>
            <p className="font-circular font-[500] text-ernieteal">+170pts</p>
          </div>
        </div>
        <div className="flex flex-row justify-between items-center gap-4 mt-4">
          <img
            src="https://i0.wp.com/ernie.london/wp-content/uploads/2023/07/Asset-3.png?fit=630,790&ssl=1"
            className="w-16 h-16 min-w-[64px] object-contain"
          ></img>
          <div className="flex flex-col justify-center flex-grow">
            <div className="flex flex-row justify-between w-full">
              <p className="font-circe font-[900] uppercase text-erniegreen leading-[24px]">
                Purchase
              </p>
              <p className="font-circular font-[500] text-erniegreen opacity-50 text-sm">
                2d ago
              </p>
            </div>
            <div className="line-clamp-1">
              <p className="font-circular font-[500] text-erniegreen">
                2kg Ernie House Single Origin Brazil
              </p>
            </div>
            <p className="font-circular font-[500] text-ernieteal">+320pts</p>
          </div>
        </div>
      </div>
    </div>
  );
};
