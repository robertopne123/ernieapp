import { Activity } from "./rewardPages/activity";
import { useState } from "react";
import { useEffect } from "react";
import { Info } from "./rewardPages/info";

export const Rewards = ({ loyaltyTiers, orders, viewImpact }) => {
  const [showingActivity, setShowingActivity] = useState(false);
  const [copied, setCopied] = useState([]);
  const [nextTier, setNextTier] = useState({});
  const [showingInfo, setShowingInfo] = useState(false);

  const back = () => {
    setShowingActivity(false);
  };

  const closeInfo = () => {
    setShowingInfo(false);
  };

  const calculateTotal = () => {
    let total = 0.0;

    for (let i = 0; i < orders.length; i++) {
      let lineItems = orders[i].lineItems.nodes;

      for (let j = 0; j < lineItems.length; j++) {
        if (lineItems[j].subtotal != null) {
          total += parseFloat(lineItems[j].subtotal);
        }
      }
    }

    return Math.floor(total);
  };

  const timeSinceRegistration = (timecode) => {
    const registrationDate = new Date(timecode);
    const now = new Date();

    let years = now.getFullYear() - registrationDate.getFullYear();
    let months = now.getMonth() - registrationDate.getMonth();
    let days = now.getDate() - registrationDate.getDate();

    // Adjust if the day difference is negative (i.e., we haven't reached the same day in the current month)
    if (days < 0) {
      const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0); // Get last day of the previous month
      days += lastMonth.getDate();
      months -= 1;
    }

    // Adjust if the month difference is negative (i.e., we haven't reached the same month in the current year)
    if (months < 0) {
      months += 12;
      years -= 1;
    }

    let result = [];
    if (years > 0) result.push(`${years} year${years > 1 ? "s" : ""}`);
    if (months > 0) result.push(`${months} month${months > 1 ? "s" : ""}`);
    if (days > 0) result.push(`${days} day${days > 1 ? "s" : ""}`);

    return result.length ? result.join(", ") + " ago" : "just now";
  };

  function checkLoyaltyTier(loyaltyTiers) {
    // Calculate the total using your existing function
    const total = calculateTotal();

    // Loop through each tier and compare total against pointsNeeded
    for (let i = 0; i < loyaltyTiers.length; i++) {
      const tier = loyaltyTiers[i];

      // If total is smaller than pointsNeeded, return the current tier
      if (total < tier.lt.pointsNeeded) {
        return tier; // Return the first tier where the condition is true
      }
    }

    // If no tier matches, return null or a default value
    return null;
  }

  useEffect(() => {
    let tempCopied = new Array(
      loyaltyTiers.reduce(
        (acc, tier) =>
          acc +
          (tier.lt.coupons ? tier.lt.coupons.length : 0) +
          (tier.lt.productOffer ? tier.lt.productOffer.length : 0),
        0
      )
    ).fill(false);

    setCopied(tempCopied);

    setNextTier(checkLoyaltyTier(loyaltyTiers));
  }, [loyaltyTiers]);

  return (
    <div className="h-[calc(100%)] overflow-y-scroll w-full bg-erniedarkcream flex flex-col gap-6 relative p-6">
      {showingActivity && <Activity backAction={back} orders={orders} />}
      {showingInfo && (
        <Info
          name={"Terms & Conditions"}
          description={
            "The Ernie Rewards Program lets you earn 1 point for every £1 spent, which can be redeemed for exclusive perks. As you accumulate points, you unlock higher-tier rewards. Points are awarded after order fulfillment, have no cash value, and cannot be exchanged for cash. Membership is open to all registered customers on ernie.london, and rewards are subject to availability. Ernie.London reserves the right to modify or terminate the program at any time. Start earning today and enjoy the best of Ernie!"
          }
          close={() => {
            closeInfo();
          }}
        />
      )}
      <div className="p-6 rounded-xl bg-ernieteal">
        <div className="flex flex-col md:flex-row-reverse justify-between">
          <p className="font-circe font-[500] text-erniecream uppercase text-2xl flex md:hidden">
            {localStorage.getItem("companyname")}
          </p>
          <p className="font-circular font-[500] text-erniecream opacity-60 flex md:hidden mb-8">
            Joined us{" "}
            {timeSinceRegistration(localStorage.getItem("registeredDate"))}
          </p>
          <div className="flex flex-row items-center gap-4 md:w-1/2">
            <div className="aspect-square w-24 min-w-[80px]">
              <div class="relative size-40">
                <svg
                  class="size-full -rotate-90"
                  viewBox="0 0 36 36"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    class="stroke-current text-erniegreen"
                    stroke-width="2.5"
                  ></circle>
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    class="stroke-current text-erniecream"
                    stroke-width="2.5"
                    stroke-dasharray="100"
                    stroke-dashoffset={`${
                      100 -
                      (calculateTotal() / nextTier?.lt?.pointsNeeded) * 100
                    }`}
                    stroke-linecap="round"
                  ></circle>
                </svg>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <p className="font-circe md:text-5xl text-4xl text-erniecream leading-[34px] mt-4">
                {calculateTotal()}
                <span className="text-xl leading-[30px] uppercase ml-1">
                  points{" "}
                </span>
              </p>
              <div className="flex-col md:flex-row flex items-start md:items-center gap-4">
                <p className="font-circular font-[500] text-erniecream opacity-60 leading-[28px]">
                  Earn 1 point for every £1 spent
                </p>
                <img
                  src="/info copy.svg"
                  className="w-8 -m-1 cursor-pointer"
                  onClick={() => {
                    setShowingInfo(true);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="flex-col md:w-1/2 hidden md:flex">
            <p className="font-circe font-[500] text-erniecream uppercase text-2xl">
              {localStorage.getItem("companyname")}
            </p>
            <p className="font-circular font-[500] text-erniecream opacity-60">
              Joined us{" "}
              {timeSinceRegistration(localStorage.getItem("registeredDate"))}
            </p>
            <div className="flex flex-row gap-4 mt-2">
              <div
                className="bg-erniegold rounded-lg px-4 py-2 cursor-pointer"
                onClick={(e) => {
                  viewImpact();
                }}
              >
                <p className="font-circular text-erniegreen font-[500]">
                  My Impact
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="bg-erniegold px-4 py-2 rounded-lg cursor-pointer "
        onClick={(e) => {
          setShowingActivity(true);
        }}
      >
        <p className="font-circe text-erniegreen font-[900] text-xl text-center">
          My Activity
        </p>
      </div>
      {loyaltyTiers
        .slice(0)
        .reverse()
        .map((tier, index) => (
          <div
            className={`bg-erniecream rounded-xl p-6 ${
              calculateTotal() < tier.lt.pointsNeeded &&
              "opacity-50 pointer-events-none"
            }`}
            key={index}
          >
            <p className="font-circe text-xl text-erniegreen font-[900] uppercase">
              Redeem for {tier.lt.pointsNeeded} points
            </p>
            <img src="/divider.png" className=" w-full mt-2"></img>
            {calculateTotal() < tier.lt.pointsNeeded && (
              <p className="font-circular font-[500] text-erniegreen leading-[20px] text-sm my-4">
                {tier.lt.pointsNeeded - calculateTotal()} more points to unlock
                more rewards
              </p>
            )}
            <div className="grid grid-cols-2 gap-4 md:flex md:flex-col flex-wrap mt-4">
              {tier.lt.coupons?.map((coupon, cIndex) => (
                <div
                  className={`flex md:flex-row flex-col justify-between md:gap-4 gap-4  mt-4 ${
                    calculateTotal() < tier.lt.pointsNeeded && "opacity-50"
                  }`}
                >
                  <div className="flex md:flex-row flex-col items-center gap-4 justify-start md:justify-start">
                    <img
                      src="/BIKE-WHEEL_COLOURED-2.png"
                      className="w-16 h-16 object-contain min-w-[64px]"
                    ></img>
                    <div className="flex flex-col justify-center">
                      <p className="font-circular font-[500] text-erniegreen leading-[20px] md:text-base text-sm text-center">
                        {coupon.title}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-row justify-center md:justify-start gap-4 items-center min-w-[120px]">
                    <div
                      className="bg-erniemint md:py-2 md:px-4 py-2 px-2 rounded-md flex flex-row gap-2 self-center hover:bg-erniegold cursor-pointer"
                      onClick={(e) => {
                        setCopied((prevCopied) => {
                          let tempCopied = [...prevCopied]; // Make a proper copy

                          tempCopied[cIndex] = true; // Set copied state to true
                          navigator.clipboard.writeText(
                            coupon.code.toUpperCase()
                          );

                          setTimeout(() => {
                            setCopied((prevCopied) => {
                              let resetCopied = [...prevCopied];
                              resetCopied[cIndex] = false;
                              return resetCopied;
                            });
                          }, 5000); // Reset after 5 seconds

                          return tempCopied;
                        });
                      }}
                    >
                      <p className="font-circular font-[500] md:text-base text-sm text-erniegreen">
                        {coupon.code.toUpperCase()}
                      </p>
                      <img src="/copy.svg" className="w-5"></img>
                    </div>
                    {copied[cIndex] && (
                      <p className="font-circular font-[500] self-center text-sm text-ernieteal">
                        Copied
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {tier.lt.productOffer?.map((product, pIndex) => (
                <div
                  className={`flex md:flex-row flex-col justify-between md:gap-4 gap-4  mt-4  ${
                    calculateTotal() < tier.lt.pointsNeeded && "opacity-50"
                  }`}
                >
                  <div className="flex md:flex-row flex-col items-center gap-4 justify-start md:justify-start">
                    <img
                      src={
                        product.product.nodes[0].featuredImage.node.sourceUrl
                      }
                      className="w-16 h-16 object-contain min-w-[64px]"
                    ></img>
                    <div className="flex flex-col justify-center">
                      <p className="font-circular font-[500] text-erniegreen leading-[20px] md:text-base text-sm text-center">
                        {product.title}
                      </p>{" "}
                    </div>
                  </div>
                  <div className="flex flex-row justify-center md:justify-start gap-4 items-center min-w-[120px] ">
                    <div
                      className="bg-erniemint py-2 md:px-4 px-2 rounded-md flex flex-row gap-2 self-center hover:bg-erniegold cursor-pointer"
                      onClick={(e) => {
                        setCopied((prevCopied) => {
                          let tempCopied = [...prevCopied]; // Make a proper copy

                          tempCopied[tier.lt.coupons.length + pIndex] = true; // Set copied state to true
                          navigator.clipboard.writeText(
                            product.code.toUpperCase()
                          );

                          setTimeout(() => {
                            setCopied((prevCopied) => {
                              let resetCopied = [...prevCopied];
                              resetCopied[
                                tier.lt.coupons.length + pIndex
                              ] = false;
                              return resetCopied;
                            });
                          }, 5000); // Reset after 5 seconds

                          return tempCopied;
                        });
                      }}
                    >
                      <p className="font-circular font-[500] md:text-base text-sm text-erniegreen">
                        {product.code.toUpperCase()}
                      </p>
                      <img src="/copy.svg" className="w-5"></img>
                    </div>
                    {copied[tier.lt.coupons?.length + pIndex] && (
                      <p className="font-circular font-[500] self-center text-sm text-ernieteal">
                        Copied
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};
