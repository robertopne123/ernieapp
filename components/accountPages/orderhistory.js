import { useState } from "react";

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

export default function OrderHistory({
  userQuantity,
  nextDelivery,
  orders,
  backAction,
}) {
  const [orderShowing, setOrderShowing] = useState(-1);

  return (
    <div className="flex flex-col flex-grow px-4 py-12 gap-4 h-full bg-erniecream">
      <div
        className="absolute top-0 left-0 p-6 bg-erniemint w-full"
        onClick={backAction}
      >
        <img src="/left-arrow.svg" className="w-6"></img>
      </div>
      <p className="uppercase font-circe font-[900] text-4xl text-erniegreen mt-16">
        Order History
      </p>
      <img src="/divider.png" className="h-1.5 w-full"></img>
      <div className="flex flex-col gap-4 h-full overflow-auto">
        {orders.map((order, index) => (
          <div key={index} className="flex flex-col gap-4">
            <div
              className="flex flex-row gap-4"
              onClick={(e) => {
                if (orderShowing == index) {
                  setOrderShowing(-1);
                } else {
                  setOrderShowing(index);
                }
              }}
            >
              <div className="flex flex-col flex-grow">
                <div className="flex flex-row justify-between">
                  <p className="font-circe text-erniegreen uppercase font-[900] text-2xl">
                    Order {order.orderNumber}
                  </p>
                  <p className="font-circe font-[900] text-erniegreen text-xl">
                    {order.status}
                  </p>
                </div>
                <p className="font-circe text-erniegreen font-[900]">
                  {getDate(order.date)}
                </p>
              </div>
              <div className="flex flex-col justify-center">
                <img
                  src="/left-arrow.svg"
                  className={`w-5 h-5 ${
                    orderShowing == index ? "rotate-90" : "-rotate-90"
                  }`}
                />
              </div>
            </div>
            <div
              className={`flex-col gap-2 bg-ernieteal p-4 ${
                orderShowing == index ? "flex" : "hidden"
              }`}
            >
              <div className="flex flex-col">
                {order.lineItems.nodes.map((lineItem, index) => (
                  <div key={index} className="flex flex-row justify-between">
                    <p className="font-circular font-[500] text-erniecream">
                      {lineItem.product.node.name}
                    </p>
                    <p className="font-circular font-[500] text-erniecream">
                      Qty: {lineItem.quantity}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
