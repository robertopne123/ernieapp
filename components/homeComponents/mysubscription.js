export const MySubscription = ({
  subscriptions,
  manageSubscription,
  quickOrderView,
  setPurchaseType,
  setPurchasing,
  setNewPurchase,
}) => {
  const getFormattedDate = (date) => {
    let dateParts = date?.split("-");

    let yearFull = dateParts?.[0];
    let yearShort = yearFull?.[2] + yearFull?.[3];

    return date ? dateParts[2] + "/" + dateParts[1] + "/" + yearShort : "//";
  };

  const setPurchaseTypeFromSub = (val) => {
    setPurchaseType(val);
  };

  return (
    <div className="py-6 px-6 w-full">
      <div className="bg-erniegold rounded-lg p-6 gap-4 flex flex-col">
        <div className="flex flex-col gap-2">
          <p className="font-circe font-[900] text-erniegreen uppercase text-xl">
            My Subscription
          </p>
          <img src="/divider.png" className="w-full"></img>
        </div>
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-6">
            <p className="font-circular font-[500] text-sm text-erniegreen">
              Frequency
            </p>
            <p className="font-circular font-[500] text-sm text-erniegreen">
              Next Delivery
            </p>
          </div>
          <div className="bg-erniegreen h-[1px] w-full"></div>
          <div className="grid grid-cols-2 gap-6">
            <p className="font-circe font-[900] text-3xl text-erniegreen uppercase">
              {subscriptions?.data?.subscription?.subscription?.billingPeriod ==
              "week"
                ? "Weekly"
                : subscriptions?.data?.subscription?.subscription
                    ?.billingPeriod == "month"
                ? "Monthly"
                : subscriptions?.data?.subscription?.subscription
                    ?.billingPeriod == ""
                ? "One-Off"
                : "Loading"}
            </p>
            <p className="font-circe font-[900] text-3xl text-erniegreen uppercase">
              {subscriptions?.data?.subscription?.subscription
                ?.nextPaymentDate &&
                (subscriptions
                  ? getFormattedDate(
                      subscriptions?.data?.subscription?.subscription?.nextPaymentDate.split(
                        " "
                      )[0]
                    )
                  : "")}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div
            className="bg-ernielightgold rounded-lg flex flex-col justify-center py-2 cursor-pointer"
            onClick={() => {
              manageSubscription();
            }}
          >
            <p className="font-circular font-[500] text-sm text-erniegreen text-center">
              Manage
            </p>
          </div>
          <div
            className="bg-ernielightgold rounded-lg flex flex-col justify-center py-2 cursor-pointer"
            onClick={() => {
              setPurchaseType(0);
              setPurchasing(true);
              setNewPurchase(true);
            }}
          >
            <p className="font-circular font-[500] text-sm text-erniegreen text-center">
              Quick Order
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
