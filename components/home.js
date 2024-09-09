import ErnieImpact from "./homeComponents/ernieimpact";
import MyOrders from "./accountPages/myorders";
import Intro from "./homeComponents/intro";
import { WelcomeMsg } from "./homeComponents/welcomemsg";
import { MySubscription } from "./homeComponents/mysubscription";
import { useEffect, useState } from "react";
import { ManagePlan } from "./homeComponents/managePlan";
import { ManageOrder } from "./homeComponents/manageOrder";
import { QuickOrder } from "./homeComponents/quickOrder";
import { About } from "./homeComponents/about";
import { HowItWorks } from "./homeComponents/howItWorks";
import { QuickOrderView } from "./homeComponents/quickOrderView";
import Alert from "./alert";

export default function Home({
  quantity,
  userQuantity,
  userTotalQuantity,
  firstName,
  setTab,
  setImpactDefaultTab,
  nextDelivery,
  role,
  companyName,
  products,
  orders,
  subscriptions,
  updateOrder,
  updateSubError,
  updatePlan,
  updatePlanFrequency,
  employerUser,
  hasSubscription,
  subscriptionAttempt,
  setPurchaseType,
  newPurchase,
  setNewPurchase,
  purchasing,
  setPurchasing,
  purchaseType,
  setManagingSubscription,
}) {
  const updateOrderFromSummary = (orderDetails) => {
    updateOrder(orderDetails);
  };

  const updatePlanFromSummary = (planDetails) => {
    updatePlan(planDetails);
  };

  const updatePlanFreqFromSummary = (planDetails) => {
    console.log(planDetails);
    updatePlanFrequency(planDetails);
  };

  const [homeTab, setHomeTab] = useState(-1);

  const [showingQuickOrders, setShowingQuickOrders] = useState(false);

  const back = () => setHomeTab(-1);

  const manageSubscription = () => {
    setHomeTab(1);
  };

  const quickOrderView = () => {
    setShowingQuickOrders(true);
  };

  const hideQuickOrderView = () => {
    setShowingQuickOrders(false);
  };

  const getOneOffOrders = () => {
    console.log(orders);

    let oneOff = [];

    for (let i = 0; i < orders.length; i++) {
      if (orders[i].createdVia != "subscription") {
        if (orders[i].status != "COMPLETED") {
          oneOff.push(orders[i]);
        }
      }
    }

    return oneOff;
  };

  const filterOrders = () => {
    let filtered = [];
    let ordersCopy = getOneOffOrders();

    console.log(ordersCopy);

    for (let i = 0; i < ordersCopy.length; i++) {
      if (ordersCopy[i].customer?.databaseId == employerUser) {
        for (let j = 0; j < ordersCopy[i].lineItems.nodes.length; j++) {
          filtered.push(ordersCopy[i].lineItems.nodes[j]);
        }
      }
    }

    return filtered;
  };

  const groupOrders = (orders) => {
    let grouped = [];

    let productFound = false;

    console.log(orders);

    for (let i = 0; i < orders.length; i++) {
      for (let j = 0; j < grouped.length; j++) {
        if (orders[i].product?.node?.name == grouped[j].product?.node?.name) {
          productFound = true;
          grouped[j].quantity++;
        }
      }

      if (!productFound) {
        grouped.push({ product: orders[i].product, quantity: 1 });
      }
    }

    return grouped;
  };

  const setPurchaseTypeFromHome = (val) => {
    setPurchaseType(val);
  };

  const setPurchasingFromHome = (val) => {
    setPurchasing(val);
  };

  const setNewPurchaseFromHome = (val) => {
    setNewPurchase(val);
  };

  const setManagingSubFromHome = (val) => {
    setManagingSubscription(val);
  };

  return (
    <div className="flex flex-col bg-erniecream overflow-auto h-[calc(100vh-80px-12vh-96px)] ">
      {homeTab == -1 && (
        <div className="flex flex-col">
          <WelcomeMsg name={firstName} />
          {subscriptionAttempt ? (
            hasSubscription ? (
              <MySubscription
                subscriptions={subscriptions}
                manageSubscription={manageSubscription}
                quickOrderView={quickOrderView}
                setPurchaseType={setPurchaseTypeFromHome}
                setPurchasing={setPurchasingFromHome}
                setNewPurchase={setNewPurchaseFromHome}
              />
            ) : (
              <div className="flex flex-col p-6">
                <div className="bg-erniegold p-6 rounded-xl">
                  <div className="flex flex-col gap-2">
                    <p className="font-circe font-[900] text-erniegreen uppercase text-xl">
                      My Subscription
                    </p>
                    <img src="/divider.png" className="w-full"></img>
                  </div>
                  <p className="font-circular text-erniegreen font-[500] mt-2">
                    You currently don&apos;t have an active subscription
                  </p>
                  <div
                    className="bg-ernielightgold rounded-xl p-2 mt-4 cursor-pointer"
                    onClick={() => {
                      setPurchaseType(1);
                      setPurchasing(true);
                      setNewPurchase(true);
                    }}
                  >
                    <p className="font-circular font-[500] text-sm text-erniegreen text-center">
                      Start Subscription
                    </p>
                  </div>
                  <div
                    className="bg-ernielightgold rounded-xl p-2 mt-4 cursor-pointer"
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
            )
          ) : (
            <div className="p-6">
              <div className="bg-erniegold p-6 rounded-xl">
                <p className="font-circe font-[900] text-erniegreen text-xl uppercase">
                  Loading...
                </p>
              </div>
            </div>
          )}
          <About />
          <HowItWorks />
        </div>
      )}

      {homeTab == 1 && (
        <ManagePlan
          backAction={back}
          products={products}
          subscriptions={subscriptions}
          orders={groupOrders(filterOrders(getOneOffOrders()))}
          updatePlan={updatePlanFromSummary}
          updatePlanFrequency={updatePlanFreqFromSummary}
          updateSubError={updateSubError}
          setPurchaseType={setPurchaseTypeFromHome}
          setPurchasing={setPurchasingFromHome}
          setNewPurchase={setNewPurchaseFromHome}
          setManagingSubscription={setManagingSubFromHome}
        />
      )}

      {console.log(updateSubError)}

      {showingQuickOrders && (
        <QuickOrderView
          close={hideQuickOrderView}
          subscriptions={subscriptions}
          orders={groupOrders(filterOrders())}
        />
      )}
      {/* <Intro
        firstName={firstName}
        userQuantity={userQuantity}
        userTotalQuantity={userTotalQuantity}
        quantity={quantity}
        setTab={setTab}
        setImpactDefaultTab={setImpactDefaultTab}
        nextDelivery={nextDelivery}
        role={role}
        companyName={companyName}
        products={products}
        orders={orders}
        subscriptions={subscriptions}
        updateOrder={updateOrderFromSummary}
        updatePlan={updatePlanFromSummary}
        employerUser={employerUser}
      /> */}
    </div>
  );
}
