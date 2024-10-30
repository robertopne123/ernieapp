import { Activity } from "./rewardPages/activity";
import { useState } from "react";

export const Rewards = () => {
  const [showingActivity, setShowingActivity] = useState(false);

  const back = () => {
    setShowingActivity(false);
  };

  return (
    <div className="h-[calc(100%-80px)] overflow-y-scroll w-full bg-erniedarkcream flex flex-col gap-6 relative p-6">
      {showingActivity && <Activity backAction={back} />}
      <div className="p-6 rounded-xl bg-ernieteal">
        <div className="flex flex-row items-center gap-4">
          <div className="aspect-square w-24 min-w-[80px]">
            <div class="relative size-40">
              <svg
                class="size-full -rotate-90"
                viewBox="0 0 36 36"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  class="stroke-current text-erniegreen dark:text-neutral-700"
                  stroke-width="2.5"
                ></circle>
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  class="stroke-current text-erniecream dark:text-blue-500"
                  stroke-width="2.5"
                  stroke-dasharray="100"
                  stroke-dashoffset={`${100 - (490 / 750) * 100}`}
                  stroke-linecap="round"
                ></circle>
              </svg>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <p className="font-circe text-5xl text-erniecream leading-[30px] mt-3">
              490<span className="text-3xl leading-[30px]">pts</span>
            </p>
            <p className="font-circular font-[500] text-erniecream opacity-60 leading-[20px]">
              {750 - 490} more points to unlock more rewards
            </p>
          </div>
        </div>
      </div>
      <div
        className="bg-erniegold px-4 py-2 rounded-lg cursor-pointer "
        onClick={(e) => {
          setShowingActivity(true);
        }}
      >
        <p className="font-circe text-erniegreen font-[900] text-xl text-center">
          My Activity
        </p>
      </div>
      <div className="bg-erniecream rounded-xl p-6">
        <p className="font-circe text-xl text-erniegreen font-[900] uppercase">
          Redeem for 750 points
        </p>
        <img src="/divider.png" className=" w-full mt-2"></img>
        <div className="flex flex-row gap-4 mt-4 opacity-50">
          <img
            src="/BIKE-WHEEL_COLOURED-2.png"
            className="w-16 h-16 object-contain min-w-[64px]"
          ></img>
          <div className="flex flex-col justify-center">
            <p className="font-circular font-[500] text-erniegreen leading-[20px]">
              Free delivery voucher
            </p>
          </div>
        </div>
        <div className="flex flex-row gap-4 mt-4 opacity-50">
          <img
            src="/tree.gif"
            className="w-16 h-16 min-w-[64px] object-contain"
          ></img>
          <div className="flex flex-col justify-center">
            <p className="font-circular font-[500] text-erniegreen leading-[20px]">
              2 trees planted
            </p>
          </div>
        </div>
      </div>
      <div className="bg-erniecream rounded-xl p-6">
        <p className="font-circe text-xl text-erniegreen font-[900] uppercase">
          Redeem for 1500 points
        </p>
        <img src="/divider.png" className=" w-full mt-2"></img>
        <div className="flex flex-row gap-4 mt-4 opacity-50">
          <img
            src="/REFIL-TUB_COLOURED-7.png"
            className="w-16 h-16 min-w-[64px] object-contain"
          ></img>
          <div className="flex flex-col justify-center">
            <p className="font-circular font-[500] text-erniegreen leading-[20px]">
              Free 1kg tub of coffee
            </p>
          </div>
        </div>
        <div className="flex flex-row gap-4 mt-4 opacity-50">
          <img
            src="/tree.gif"
            className="w-16 h-16 min-w-[64px] object-contain"
          ></img>
          <div className="flex flex-col justify-center">
            <p className="font-circular font-[500] text-erniegreen leading-[20px]">
              5 trees planted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
