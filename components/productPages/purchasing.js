import { useState } from "react";

export const Purchasing = ({
  purchaseType,
  close,
  setPurchaseType,
  setPurchasing,
  setNewPurchase,
}) => {
  const [loading, setLoading] = useState(false);

  return (
    <div className="fixed top-0 left-0 bg-erniegreen h-screen w-full z-[20] bg-opacity-70 backdrop-blur p-6 flex flex-col justify-center">
      <div className="flex flex-col justify-center gap-6">
        <div
          className="bg-erniegold rounded-lg py-2"
          onClick={() => {
            setNewPurchase(true);
          }}
        >
          <p className="font-circe text-erniegreen text-xl text-center">
            {purchaseType == 0
              ? "Continue One-off Order"
              : "Continue Subscription Setup"}
          </p>
        </div>
        <div
          className="bg-erniegold rounded-lg py-2"
          onClick={() => {
            setNewPurchase(true);

            if (purchaseType == 0) {
              setPurchaseType(1);
            } else {
              setPurchaseType(0);
            }
          }}
        >
          <p className="font-circe text-erniegreen text-xl text-center">
            {purchaseType == 0 ? "Start Subscription" : "New One-off Order"}
          </p>
        </div>
        <div
          className="bg-erniegold rounded-lg py-2"
          onClick={() => {
            setPurchaseType(-1);
            setPurchasing(false);
            close();
          }}
        >
          <p className="font-circe text-erniegreen text-xl text-center">
            Just Browse
          </p>
        </div>
      </div>
    </div>
  );
};
