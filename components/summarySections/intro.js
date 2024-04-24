import { useState } from "react";
import { ManageOrder } from "./manageOrder";
import { ManagePlan } from "./managePlan";
import { QuickOrder } from "./quickOrder";

export default function Intro({
  firstName,
  quantity,
  userQuantity,
  userTotalQuantity,
  setTab,
  setImpactDefaultTab,
  nextDelivery,
  role,
  companyName,
  products,
  orders,
  subscriptions,
  updateOrder,
  updatePlan,
}) {
  const [summaryTab, setSummaryTab] = useState(-1);

  const back = () => setSummaryTab(-1);

  const updateOrderFromIntro = (orderDetails) => {
    updateOrder(orderDetails);
  };

  const getFormattedDate = (date) => {
    let dateParts = date?.split("-");

    return date ? dateParts[2] + "/" + dateParts[1] + "/" + dateParts[0] : "//";
  };

  const updatePlanFromIntro = (planDetails) => {
    updatePlan(planDetails);
  };

  return (
    <div>
      {summaryTab == 0 && (
        <ManageOrder
          backAction={back}
          deliveryDate={nextDelivery}
          products={products}
          orders={orders}
          updateOrder={updateOrderFromIntro}
        />
      )}
      {summaryTab == 1 && (
        <ManagePlan
          backAction={back}
          products={products}
          subscriptions={subscriptions}
          updatePlan={updatePlanFromIntro}
        />
      )}
      {summaryTab == 2 && (
        <QuickOrder
          backAction={back}
          subscriptions={subscriptions}
          products={products}
        />
      )}
      {summaryTab == -1 && (
        <div className="bg-erniecream pt-12 flex flex-col h-full gap-4">
          <div className="flex flex-col gap-2 px-4">
            <p className="font-circe text-3xl text-erniegreen font-[900] uppercase">
              Welcome {firstName}
            </p>
            <p className="font-circular text-erniegreen font-[500]">
              The Ernie app is here to make ordering and reordering your
              workplace essentials a doddle.
            </p>
          </div>
          <div className="flex flex-col gap-0 px-4 pb-2 pt-4">
            <p className="font-circe text-2xl text-erniegreen font-[900] uppercase mt-2">
              Your Latest Order
            </p>
            <img src="/divider.png" className="h-1.5 w-full mt-2"></img>
            <div className="grid grid-cols-2 mt-2">
              <div className="flex flex-col gap-2">
                <p className="font-circular text-erniegreen font-[500]">
                  Order Type
                </p>
                <p className="font-circe text-erniegreen font-[900] text-3xl uppercase">
                  Plan
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="font-circular text-erniegreen font-[500]">
                  Delivery Date
                </p>
                <p className="font-circe text-erniegreen font-[900] text-3xl">
                  {nextDelivery}
                </p>
              </div>
            </div>
            <p
              className="font-circe text-erniegreen font-[900] uppercase text-xl hover:underline mt-2"
              onClick={(e) => {
                setSummaryTab(0);
              }}
            >
              Manage Order &#62;
            </p>
          </div>
          <div className="flex flex-col gap-0 px-4 py-6  bg-ernieteal">
            <p className="font-circe text-2xl text-erniecream font-[900] uppercase mt-2">
              Your Plan
            </p>
            <img src="/divider_cream.png" className="h-1.5 w-full mt-2"></img>
            <div className="grid grid-cols-2 mt-2">
              <div className="flex flex-col gap-2">
                <p className="font-circular text-erniecream font-[500]">
                  Frequency
                </p>
                <p className="font-circe text-erniecream font-[900] text-3xl uppercase">
                  {subscriptions?.data?.subscription.subscription
                    .billingPeriod == "week"
                    ? "Weekly"
                    : subscriptions?.data?.subscription.subscription
                        .billingPeriod == "month"
                    ? "Monthly"
                    : subscriptions?.data?.subscription.subscription
                        .billingPeriod == ""
                    ? "One-Off"
                    : "Loading"}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="font-circular text-erniecream font-[500]">
                  Next Delivery
                </p>
                <p className="font-circe text-erniecream font-[900] text-3xl">
                  {subscriptions
                    ? getFormattedDate(
                        subscriptions?.data?.subscription.subscription.nextPaymentDate.split(
                          " "
                        )[0]
                      )
                    : ""}
                </p>
              </div>
            </div>
            <p
              className="font-circe text-erniecream font-[900] uppercase text-xl hover:underline mt-2"
              onClick={(e) => {
                setSummaryTab(1);
              }}
            >
              Manage Plan &#62;
            </p>
          </div>
          <div className="flex flex-col px-4 gap-4 mt-2">
            <p className="font-circular text-erniegreen font-[500]">
              Running low on your favourite coffee? Top up your supplies without
              affecting your subscription.
            </p>
            <div
              className="bg-erniegreen px-4 py-4 mb-4"
              onClick={(e) => {
                setSummaryTab(2);
              }}
            >
              <p className="text-erniecream font-circe uppercase text-center font-[900] text-xl">
                New Quick Order
              </p>
            </div>
          </div>
          {/* <div className="flex flex-col gap-0 px-4 py-8 bg-ernieteal">
        <p className="font-circe text-2xl text-erniecream font-[900] uppercase mt-2">
          Ernie&apos;s Impact
        </p>
        <img src="/divider_cream.png" className="h-1.5 w-full mt-2"></img>
        <div className="grid grid-cols-2 mt-2">
          <div className="flex flex-col gap-2">
            <p className="font-circular text-erniecream font-[500]">
              Carbon Removed
            </p>
            <p className="font-circe text-erniecream font-[900] text-4xl">
              {24723 + Math.round(quantity * 0.44)}kg
            </p>
          </div>
        </div>
        <p
          className="font-circe text-erniecream font-[900] uppercase text-xl hover:underline mt-2"
          onClick={(e) => {
            setImpactDefaultTab(1);
            setTab(2);
          }}
        >
          View Ernie&apos;s Impact &#62;
        </p>
      </div> */}
        </div>
      )}
    </div>
  );
}
