import { useEffect, useState } from "react";
import Image from "next/image";
import { OrderDetails } from "./orderDetails";

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

  useEffect(() => {
    sortedOrders();
  }, []);

  const [currentOrder, setCurrentOrder] = useState({});

  const close = () => {
    setOrderShowing(-1);
  };

  return (
    <div className="flex flex-col p-6 gap-6 lg:gap-10 lg:p-10 h-full max-h-[100%] bg-erniedarkcream">
      <div
        className="py-2 flex flex-row items-center gap-1 border-b-[1px] border-erniegreen cursor-pointer"
        onClick={backAction}
      >
        <div className="h-3 w-3 lg:w-4 lg:h-4 relative">
          <Image src="/left-arrow.svg" fill={true} className="h-6"></Image>
        </div>
        <p className="font-circular font-[500] text-center text-sm text-erniegreen lg:text-base">
          Back
        </p>
      </div>
      {orderShowing != -1 && (
        <OrderDetails order={currentOrder} close={close} />
      )}

      <div className="grid-rows-2 lg:grid-cols-2 lg:grid-rows-1 grid h-[calc(100%-37px)] gap-4 lg:gap-10 pb-6 lg:pb-0">
        <div className="w-full p-6 bg-erniecream flex flex-col flex- gap-2 rounded-xl">
          <p className="font-circe font-[900] text-lg text-erniegreen uppercase lg:text-xl">
            Subscription History
          </p>
          <img src="/divider.png" className="w-full"></img>
          <div className="flex flex-col gap-2 mt-2 lg:mt-4 flex-shrink lg:flex-grow overflow-auto">
            {subscriptionOrders.length == 0 && (
              <div className="flex flex-col justify-center h-full flex-grow">
                <p className="font-circular text-erniegreen text-center font-[500]">
                  You currently have no orders.
                </p>
              </div>
            )}
            {subscriptionOrders.map((order, index) => (
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

        <div className="w-full p-6 bg-erniecream flex flex-col gap-2 rounded-xl">
          <p className="font-circe font-[900] text-lg text-erniegreen uppercase lg:text-xl">
            One Off Order History
          </p>
          <img src="/divider.png" className="w-full"></img>
          <div className="flex flex-col gap-2 lg:gap-3 mt-2 lg:mt-4 flex-grow overflow-auto">
            {otherOrders.length == 0 && (
              <div className="flex flex-col justify-center h-full flex-grow">
                <p className="font-circular text-erniegreen text-center font-[500]">
                  You currently have no orders.
                </p>
              </div>
            )}
            {otherOrders.map((order, index) => (
              <div className="flex flex-col relative" key={index}>
                <div className="flex flex-row gap-2">
                  <div className="flex flex-row justify-between flex-grow">
                    <p className="font-circular text-erniegreen font-[900] text-sm lg:text-base">
                      {getDate(order.date)}
                    </p>
                    <p className="font-circular text-erniegreen italic font-[900] text-xs lg:text-sm">
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
                <div className="flex flex-row absolute bottom-0 lg:bottom-[-4px]">
                  <p className="font-circular text-erniegreen italic text-xs lg:text-sm">
                    Order {order.orderNumber}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
