export default function Intro({
  firstName,
  quantity,
  userQuantity,
  userTotalQuantity,
  setTab,
  setImpactDefaultTab,
  role,
  companyName,
}) {
  return (
    <div className="bg-erniecream pt-12 flex flex-col justify-between h-full gap-4">
      <div className="flex flex-col gap-4 px-4">
        <p className="font-circe text-3xl text-erniegreen font-[900] uppercase">
          Welcome {firstName}
        </p>
        <p className="font-circular text-erniegreen font-[500]">
          Welcome to the Ernie London App. From here you see{" "}
          {role == 0 ? "your" : companyName + "'s"} impact, view your rewards
          and order to your desk.
        </p>
      </div>
      <div className="flex flex-col gap-0 px-4 pb-4">
        <p className="font-circe text-2xl text-erniegreen font-[900] uppercase mt-2">
          Account Summary
        </p>
        <img src="/divider.png" className="h-1.5 w-full mt-2"></img>
        <div className="grid grid-cols-2 mt-2">
          <div className="flex flex-col gap-2">
            <p className="font-circular text-erniegreen font-[500]">Orders</p>
            <p className="font-circe text-erniegreen font-[900] text-4xl">
              {userQuantity}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-circular text-erniegreen font-[500]">
              Carbon Removed
            </p>
            <p className="font-circe text-erniegreen font-[900] text-4xl">
              {userTotalQuantity * 0.44}kg
            </p>
          </div>
        </div>
        <p
          className="font-circe text-erniegreen font-[900] uppercase text-xl hover:underline mt-2"
          onClick={(e) => {
            setImpactDefaultTab(0);
            setTab(2); //IMPACT TAB
          }}
        >
          View {role == 0 ? "My" : "Our"} Impact &#62;
        </p>
      </div>
      <div className="flex flex-col gap-0 px-4 py-8 bg-ernieteal">
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
      </div>
    </div>
  );
}
