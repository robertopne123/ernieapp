import { Basket } from "./basket";
import Image from "next/image";
import { useRouter } from "next/router";
import { User } from "./user";

export const StaticTopBar = ({
  addToSubBasket,
  addToOneOffBasket,
  updateSubBasket,
  updateOneOffBasket,
  clearSubBasket,
  clearOneOffBasket,
  setNewSubFrequency,
  newSubFreq,
  subBasket,
  oneOffBasket,
  purchaseType,
  hasSubscription,
  customerId,
  setSubscriptions,
  setHasSubscription,
  subscriptions,
  managingSubscription,
  updatePlanFrequency,
  updatePlan,
  orderComplete,
  setOrderComplete,
  orderDetails,
  setOrderDetails,
  showingBasket,
  setShowingBasket,
  coupons,
  products,
  orderHistory,
  setOrderHistory,
  cfh,
}) => {
  const addToSubBasketFromBar = (item) => {
    addToSubBasket(item);
  };

  const addToOneOffBasketFromBar = (item) => {
    addToOneOffBasket(item);
  };

  const updateSubBasketFromBar = (basketCopy) => {
    updateSubBasket(basketCopy);
  };

  const updateOneOffBasketFromBar = (basketCopy) => {
    updateOneOffBasket(basketCopy);
  };

  const updateNewSubFreqFromBar = (freq) => {
    setNewSubFrequency(freq);
  };

  const clearSubBasketFromBar = () => {
    clearSubBasket();
  };

  const clearOneOffBasketFromBar = () => {
    clearOneOffBasket();
  };

  const setSubscriptionsFromBar = (sub) => {
    setSubscriptions(sub);
  };

  const setHasSubscriptionFromBar = (val) => {
    setHasSubscription(val);
  };

  const updatePlanFromBar = (val) => {
    updatePlan(val);
  };

  const updatePlanFreqFromBar = (val) => {
    updatePlanFrequency(val);
  };

  const setOrderCompleteFromBar = (val) => {
    setOrderComplete(val);
  };

  const setOrderDetailsFromBar = (val) => {
    setOrderDetails(val);
  };

  const setShowingBasketFromBar = (val) => {
    setShowingBasket(val);
  };

  const setOrderHistoryFromBar = (val) => {
    setOrderHistory(val);
  };

  const router = useRouter();

  return (
    <div className="h-20 w-full bg-ernieteal py-4 px-6 flex flex-row justify-between z-[20]">
      <div className="flex flex-row gap-6">
        <img src="/Asset-1@2x2.png" className="w-32 my-auto"></img>
        <div
          className="rounded-lg flex flex-row gap-1 justify-center items-center cursor-pointer hover:opacity-60 hidden lg:flex"
          onClick={(e) => {
            router.push("https://ernie.london");
          }}
        >
          <div className="h-3 w-3 lg:w-4 lg:h-4 relative">
            <Image
              src="/left-arrow-cream.svg"
              fill={true}
              className="h-6 "
            ></Image>
          </div>
          <p className="font-circular font-[500] text-erniecream text-sm">
            Back To Website
          </p>
        </div>
      </div>
      <div className="flex flex-row items-center gap-2">
        <User />
        <Basket
          addToSubBasket={addToSubBasketFromBar}
          addToOneOffBasket={addToOneOffBasketFromBar}
          updateSubBasket={updateSubBasketFromBar}
          updateOneOffBasket={updateOneOffBasketFromBar}
          clearSubBasket={clearSubBasketFromBar}
          clearOneOffBasket={clearOneOffBasketFromBar}
          setNewSubFrequency={updateNewSubFreqFromBar}
          newSubFreq={newSubFreq}
          subBasket={subBasket}
          oneOffBasket={oneOffBasket}
          purchaseType={purchaseType}
          hasSubscription={hasSubscription}
          customerId={customerId}
          setSubscriptions={setSubscriptionsFromBar}
          setHasSubscription={setHasSubscriptionFromBar}
          subscriptions={subscriptions}
          managingSubscription={managingSubscription}
          updatePlan={updatePlanFromBar}
          updatePlanFrequency={updatePlanFreqFromBar}
          orderComplete={orderComplete}
          setOrderComplete={setOrderCompleteFromBar}
          orderDetails={orderDetails}
          setOrderDetails={setOrderDetailsFromBar}
          showingBasket={showingBasket}
          setShowingBasket={setShowingBasketFromBar}
          coupons={coupons}
          products={products}
          orderHistory={orderHistory}
          setOrderHistory={setOrderHistoryFromBar}
          cfh={cfh}
        />
      </div>
    </div>
  );
};
