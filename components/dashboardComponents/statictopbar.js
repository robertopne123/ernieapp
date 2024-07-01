import { Basket } from "./basket";

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

  return (
    <div className="h-20 w-full bg-ernieteal py-4 px-6 flex flex-row justify-between z-[999]">
      <img src="/Asset-1@2x2.png" className="w-32 my-auto"></img>
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
      />
    </div>
  );
};
