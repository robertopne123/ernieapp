import Image from "next/image";

export const DeliveryAndReturns = ({ backAction }) => {
  return (
    <div className="bg-erniedarkcream h-full px-6 flex flex-col gap-6">
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
      <p>Returns Policy</p>
    </div>
  );
};
