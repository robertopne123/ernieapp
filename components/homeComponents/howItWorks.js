import { Step } from "./howItWorksComponents/step";

export const HowItWorks = () => {
  return (
    <div className="flex flex-col gap-8 lg:gap-10 bg-erniemint p-6 lg:p-10">
      <div className="flex flex-col gap-2">
        <p className="font-circe font-[900] text-erniegreen uppercase text-xl lg:text-3xl lg:text-center">
          How it works
        </p>
        <img src="/divider.png" className="w-full lg:hidden"></img>
      </div>
      <div className="grid grid-cols-2">
        <Step
          step={"Step 1"}
          line={"We Roast"}
          gif={"/ROASTERY_COLOURED.webp"}
        />
        <Step
          step={"Step 2"}
          line={"We Deliver"}
          gif={"/BIKE-WHEEL_COLOURED.webp"}
        />
        <Step
          step={"Step 3"}
          line={"You Enjoy"}
          gif={"/POURING-COFFEE_COLOURED.webp"}
        />
        <Step
          step={"Step 4"}
          line={"We Refill*"}
          gif={"/REFIL-TUB_COLOURED.webp"}
        />
      </div>
      <p className="font-circular text-erniegreen lg:text-center">
        *The refill option only applies to purchases packaged in a white tub.
      </p>
    </div>
  );
};
