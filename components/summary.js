import ErnieImpact from "./summarySections/ernieimpact";
import MyOrders from "./accountPages/myorders";
import Intro from "./summarySections/intro";

export default function Summary({
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
  updatePlan,
}) {
  const updateOrderFromSummary = (orderDetails) => {
    updateOrder(orderDetails);
  };

  const updatePlanFromSummary = (planDetails) => {
    updatePlan(planDetails);
  };

  return (
    <div className="flex flex-col bg-erniecream overflow-auto h-full">
      {console.log(quantity)}
      <Intro
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
      />
    </div>
  );
}
