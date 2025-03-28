import Image from "next/image";

export const Activity = ({ backAction, orders }) => {
  const filterOrders = () => {
    let filteredOrders = [];

    for (let i = 0; i < orders.length; i++) {
      let order = orders[i];
      let orderTotal = 0.0;

      for (let j = 0; j < order.lineItems.nodes.length; j++) {
        if (order.lineItems.nodes[j].subtotal != null) {
          orderTotal += parseFloat(order.lineItems.nodes[j].subtotal);
        }
      }

      if (orderTotal != 0.0) {
        filteredOrders.push(order);
      }
    }

    return filteredOrders;
  };

  const getTotal = (order) => {
    let total = 0.0;

    for (let j = 0; j < order.lineItems.nodes.length; j++) {
      if (order.lineItems.nodes[j].subtotal != null) {
        total += parseFloat(order.lineItems.nodes[j].subtotal);
      }
    }

    return Math.floor(total);
  };

  const timeSinceRegistration = (timecode) => {
    const registrationDate = new Date(timecode);
    const now = new Date();
    const diffInSeconds = Math.floor((now - registrationDate) / 1000);

    const units = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "week", seconds: 604800 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
      { label: "second", seconds: 1 },
    ];

    const unit = units.find(({ seconds }) => diffInSeconds >= seconds);
    if (unit) {
      const interval = Math.floor(diffInSeconds / unit.seconds);
      return `${interval} ${unit.label}${interval > 1 ? "s" : ""} ago`;
    }

    return "just now";
  };

  const getLineItemsString = (items) => {
    let str = "";

    console.log(items);

    for (let i = 0; i < items.length; i++) {
      if (i == 0) {
        str += items[i].product?.node?.name;
      } else if (i == items.length - 1) {
        str += ", and ";
        str += items[i].product?.node?.name;
      } else {
        str += ", ";
        str += items[i].product?.node?.name;
      }
    }

    return str;
  };

  return (
    <div className="absolute top-0 left-0 z-10 bg-erniedarkcream h-full flex-grow flex flex-col overflow-y-auto gap-6 pb-6 w-full px-6">
      <div
        className="py-2 lg:pt-10 flex flex-row items-center gap-1 border-b-[1px] border-erniegreen cursor-pointer"
        onClick={backAction}
      >
        <div className="h-3 w-3 lg:w-4 lg:h-4 relative">
          <Image src="/left-arrow.svg" fill={true} className="h-6"></Image>
        </div>
        <p className="font-circular font-[500] text-center text-sm text-erniegreen lg:text-base">
          Back
        </p>
      </div>
      <div className="bg-erniecream rounded-xl p-6">
        <p className="font-circe text-xl text-erniegreen font-[900] uppercase">
          My Activity
        </p>
        <img src="/divider.png" className=" w-full mt-2"></img>
        {console.log(orders)}
        {filterOrders().map((order, index) => (
          <div className="flex flex-row justify-between gap-4 mt-4 items-center">
            <img
              src={
                order.lineItems.nodes[0].product?.node?.featuredImage?.node
                  ?.sourceUrl
              }
              className="w-16 h-16 min-w-[64px] object-contain"
            ></img>
            <div className="flex flex-col justify-center flex-grow">
              <div className="flex flex-row justify-between w-full">
                <p className="font-circe font-[900] uppercase text-erniegreen leading-[24px]">
                  Purchase
                </p>
                <p className="font-circular font-[500] text-erniegreen opacity-50 text-sm">
                  {timeSinceRegistration(order.date)}
                </p>
              </div>
              <div className="line-clamp-1">
                <p className="font-circular font-[500] text-erniegreen text-ellipsis max-w-[50ch]">
                  {getLineItemsString(order.lineItems.nodes)}
                </p>
              </div>
              <p className="font-circular font-[500] text-ernieteal">
                +{getTotal(order)}pts
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
