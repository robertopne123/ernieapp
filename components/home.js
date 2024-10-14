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
import { OrderDetails } from "./accountPages/orderDetails";

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
  setCurrentTab,
  setShowingCert,
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

  const getDate = (date) => {
    let formattedDateTime = new Date(date).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "numeric",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    let formattedDate = formattedDateTime.split(",")[0];

    return formattedDate;
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

  const [orderShowing, setOrderShowing] = useState(-1);

  const [subscriptionOrders, setSubOrders] = useState([]);
  const [otherOrders, setOtherOrders] = useState([]);

  const sortedOrders = () => {
    let sub = [];
    let other = [];

    for (let i = 0; i < orders.length; i++) {
      if (orders[i].createdVia == "subscription") {
        sub.push(orders[i]);
      } else {
        other.push(orders[i]);
      }
    }

    setSubOrders(sub);
    setOtherOrders(other);
  };

  const itemCount = (order) => {
    let count = 0;

    for (let i = 0; i < order.lineItems.nodes.length; i++) {
      count += order.lineItems.nodes[i].quantity;
    }

    return count;
  };

  const getTotalItemCount = () => {
    let count = 0;

    for (let i = 0; i < orders.length; i++) {
      count += itemCount(orders[i]);
    }

    return count;
  };

  useEffect(() => {
    sortedOrders();
  }, []);

  const [currentOrder, setCurrentOrder] = useState({});

  const close = () => {
    setOrderShowing(-1);
  };

  const [client, setClient] = useState(
    JSON.parse(localStorage.getItem("client"))
  );

  return (
    <div className="flex flex-col bg-erniecream overflow-auto h-[calc(100vh-80px-12vh-96px)] lg:h-full">
      {orderShowing != -1 && (
        <OrderDetails order={currentOrder} close={close} />
      )}
      {homeTab == -1 && (
        <div className="flex flex-col">
          <WelcomeMsg name={firstName} />
          {subscriptionAttempt ? (
            hasSubscription ? (
              <div className="flex flex-col lg:grid lg:grid-cols-3 lg:auto-rows-fr lg:h-[400px] gap-6 p-6 lg:p-10">
                <MySubscription
                  subscriptions={subscriptions}
                  manageSubscription={manageSubscription}
                  quickOrderView={quickOrderView}
                  setPurchaseType={setPurchaseTypeFromHome}
                  setPurchasing={setPurchasingFromHome}
                  setNewPurchase={setNewPurchaseFromHome}
                />

                <div className="w-full p-6 bg-erniedarkcream flex-col gap-2 rounded-lg hidden lg:flex ">
                  <p className="font-circe font-[900] text-xl text-erniegreen uppercase">
                    Order Summary
                  </p>
                  <img src="/divider.png" className="w-full"></img>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <p className="font-circular font-[500] text-sm text-erniegreen">
                      Orders Placed
                    </p>

                    <p className="font-circular font-[500] text-sm text-erniegreen">
                      Carbon Saved
                    </p>
                  </div>
                  <div className="bg-erniegreen h-[1px] w-full"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-row gap-2">
                      <p className="font-circe text-4xl font-[900] text-erniegreen mt-6">
                        {orders.length}
                      </p>
                    </div>
                    <div className="flex flex-row gap-2">
                      <p className="font-circe text-6xl text-erniegreen">
                        <p className="font-circe xl:text-4xl text-2xl font-[900] text-erniegreen mt-6">
                          {client.impactFigures.carbon != null
                            ? client.impactFigures.carbon
                            : 0}
                          <span className="text-2xl">kg</span>
                        </p>
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:mt-2">
                    <div
                      className="bg-erniegold rounded-lg flex flex-col justify-center py-2 cursor-pointer"
                      onClick={() => {
                        setCurrentTab(2);
                      }}
                    >
                      <p className="font-circular font-[500] text-sm text-erniegreen text-center">
                        View Impact
                      </p>
                    </div>
                    <div
                      className="bg-erniegold rounded-lg flex flex-col justify-center py-2 cursor-pointer"
                      onClick={() => {
                        setCurrentTab(2);
                      }}
                    >
                      <p className="font-circular font-[500] text-sm text-erniegreen text-center">
                        Impact Certificate
                      </p>
                    </div>
                  </div>
                </div>

                <div className="w-full px-6 pt-6 bg-erniedarkcream flex-col gap-2 rounded-lg hidden lg:flex h-auto">
                  <p className="font-circe font-[900] text-xl text-erniegreen uppercase">
                    Order History
                  </p>
                  <img src="/divider.png" className="w-full"></img>
                  <div className="flex flex-col gap-2 mt-4 overflow-auto h-[calc(100%-72px)] lg:h-full lg:pb-6 overflow-y-scroll">
                    {orders.length == 0 && (
                      <div className="h-full flex-grow w-full flex flex-col justify-center">
                        <p className="font-circular text-erniegreen font-[500] text-center">
                          You currently have no orders.
                        </p>
                      </div>
                    )}
                    {orders.map((order, index) => (
                      <div className="flex flex-col relative" key={index}>
                        <div className="flex flex-row gap-2">
                          <div className="flex flex-row justify-between flex-grow">
                            <p className="font-circular text-erniegreen font-[900] text-sm">
                              {getDate(order.date)}
                            </p>
                            <p className="font-circular text-erniegreen italic font-[900] text-xs">
                              {itemCount(order) == 1
                                ? `${itemCount(order)} item`
                                : `${itemCount(order)} items`}
                            </p>
                          </div>
                          <img
                            src="/info.svg"
                            className="w-8 h-8 mb-1"
                            onClick={() => {
                              setOrderShowing(0);
                              setCurrentOrder(order);
                            }}
                          ></img>
                        </div>
                        <div className="flex flex-row absolute bottom-0">
                          <p className="font-circular text-erniegreen italic text-xs">
                            Order {order.orderNumber}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col lg:grid lg:grid-cols-3 lg:auto-rows-fr lg:h-[400px] gap-6 p-6 lg:p-10">
                <div className="bg-erniegold p-6  rounded-xl">
                  <div className="flex flex-col gap-2">
                    <p className="font-circe font-[900] text-erniegreen uppercase text-xl lg:text-2xl">
                      My Subscription
                    </p>
                    <img src="/divider.png" className="w-full w-[300px]"></img>
                  </div>
                  <p className="font-circular text-erniegreen font-[500] mt-2">
                    You currently don&apos;t have an active subscription
                  </p>
                  <div className="grid grid-cols-1  w-full gap-0 lg:gap-4">
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
                      className="bg-ernielightgold rounded-xl p-2 mt-4 lg:mt-0 cursor-pointer"
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
                <div className="w-full p-6 bg-erniedarkcream flex-col gap-2 rounded-lg hidden lg:flex ">
                  <p className="font-circe font-[900] text-xl text-erniegreen uppercase">
                    Order Summary
                  </p>
                  <img src="/divider.png" className="w-full"></img>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <p className="font-circular font-[500] text-sm text-erniegreen">
                      Orders Placed
                    </p>

                    <p className="font-circular font-[500] text-sm text-erniegreen">
                      Carbon Saved
                    </p>
                  </div>
                  <div className="bg-erniegreen h-[1px] w-full"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-row gap-2">
                      <p className="font-circe text-4xl font-[900] text-erniegreen mt-6">
                        {orders.length}
                      </p>
                    </div>
                    <div className="flex flex-row gap-2">
                      <p className="font-circe text-6xl text-erniegreen">
                        <p className="font-circe xl:text-4xl text-2xl font-[900] text-erniegreen mt-6">
                          {client.impactFigures.carbon != null
                            ? client.impactFigures.carbon
                            : 0}
                          <span className="text-2xl">kg</span>
                        </p>
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:mt-2">
                    <div
                      className="bg-erniegold rounded-lg flex flex-col justify-center py-2 cursor-pointer"
                      onClick={() => {
                        setCurrentTab(2);
                      }}
                    >
                      <p className="font-circular font-[500] text-sm text-erniegreen text-center">
                        View Impact
                      </p>
                    </div>
                    <div
                      className="bg-erniegold rounded-lg flex flex-col justify-center py-2 cursor-pointer"
                      onClick={() => {
                        setCurrentTab(2);
                      }}
                    >
                      <p className="font-circular font-[500] text-sm text-erniegreen text-center">
                        Impact Certificate
                      </p>
                    </div>
                  </div>
                </div>

                <div className="w-full px-6 pt-6 lg:pt-6 bg-erniedarkcream flex-col gap-2 rounded-lg hidden lg:flex h-auto">
                  <p className="font-circe font-[900] text-xl text-erniegreen uppercase">
                    Order History
                  </p>
                  <img src="/divider.png" className="w-full"></img>
                  <div className="flex flex-col gap-2 mt-4 overflow-auto h-[calc(100%-72px)] lg:h-full lg:pb-6 overflow-y-scroll">
                    {orders.length == 0 && (
                      <div className="h-full flex-grow w-full flex flex-col justify-center">
                        <p className="font-circular text-erniegreen font-[500] text-center">
                          You currently have no orders.
                        </p>
                      </div>
                    )}
                    {orders.map((order, index) => (
                      <div className="flex flex-col relative" key={index}>
                        <div className="flex flex-row gap-2">
                          <div className="flex flex-row justify-between flex-grow">
                            <p className="font-circular text-erniegreen font-[900] text-sm">
                              {getDate(order.date)}
                            </p>
                            <p className="font-circular text-erniegreen italic font-[900] text-xs">
                              {itemCount(order) == 1
                                ? `${itemCount(order)} item`
                                : `${itemCount(order)} items`}
                            </p>
                          </div>
                          <img
                            src="/info.svg"
                            className="w-8 h-8 mb-1"
                            onClick={() => {
                              setOrderShowing(0);
                              setCurrentOrder(order);
                            }}
                          ></img>
                        </div>
                        <div className="flex flex-row absolute bottom-0">
                          <p className="font-circular text-erniegreen italic text-xs">
                            Order {order.orderNumber}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="p-6 lg:p-10">
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
