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
}) {
  const updateOrderFromSummary = (orderDetails) => {
    updateOrder(orderDetails);
  };

  const updatePlanFromSummary = (planDetails) => {
    updatePlan(planDetails);
  };

  const updatePlanFreqFromSummary = (planDetails) => {
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

  return (
    <div className="flex flex-col bg-erniecream overflow-auto h-[calc(100vh-80px-12vh)] ">
      {homeTab == -1 && (
        <div className="flex flex-col">
          <WelcomeMsg name={firstName} />
          <MySubscription
            subscriptions={subscriptions}
            manageSubscription={manageSubscription}
            quickOrderView={quickOrderView}
          />
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
