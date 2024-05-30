import { useState } from "react";

export const ConfirmFrequency = ({
  close,
  difference,
  update,
  updateSubError,
}) => {
  const [loading, setLoading] = useState(false);

  return (
    <div className="absolute top-0 bg-erniegreen h-screen w-full z-[20] bg-opacity-70 p-6 flex flex-col justify-center">
      <div className="p-6 bg-erniemint w-full rounded-lg flex flex-col items-end gap-4">
        <img
          src="/cross.svg"
          className="w-3 align cursor-pointer"
          onClick={() => {
            close();
          }}
        ></img>
        <div className="bg-erniecream p-6 w-full rounded-lg flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="font-circe font-[900] text-lg text-erniegreen uppercase">
              Frequency
            </p>
            <img src="/divider.png" className="w-full"></img>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-circular text-sm font-[500] text-erniegreen">
              {difference.billingPeriod == "week" &&
                difference.billingInterval == "1" &&
                "Weekly"}
              {difference.billingPeriod == "week" &&
                difference.billingInterval == "2" &&
                "Bi-weekly (once every two weeks)"}
              {difference.billingPeriod == "month" &&
                difference.billingInterval == "1" &&
                "Monthly"}
              {difference.billingPeriod == "month" &&
                difference.billingInterval == "2" &&
                "Bi-monthly (once every two months)"}
            </p>

            {console.log(difference)}
            {/* {difference.map((lineItem, index) => (
              <>
                {lineItem.quantity != 0 && (
                  <div className="flex flex-row justify-between" key={index}>
                    <p className="font-circular text-sm font-[500] text-erniegreen">
                      {lineItem.product.node.name}
                    </p>
                    <p className="font-circular text-sm font-[500] text-erniegreen">
                      {lineItem.quantity}
                    </p>
                  </div>
                )}
              </>
            ))} */}
          </div>
          <div
            className="bg-erniegold px-4 py-2 rounded-lg cursor-pointer"
            onClick={() => {
              update();
            }}
          >
            <p className="font-circe text-erniegreen font-[900] text-xl text-center">
              Confirm & Save Selection
            </p>
          </div>
          <p className="font-circular text-xs text-erniegreen font-[900] text-center">
            Note that when you confirm, your selection will apply to your{" "}
            <span className="underline">next order.</span>
          </p>
          {updateSubError != "" && (
            <p className="font-circular text-xs text-red-400 font-[900] text-center">
              {updateSubError + " "}
              <a href="tel: 0203 8838659" className="underline">
                Please contact us.
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
