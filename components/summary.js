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
  role,
  companyName,
}) {
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
        role={role}
        companyName={companyName}
      />
    </div>
  );
}
