import { useState } from "react";

export const OrderDetails = ({ close, order }) => {
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="fixed top-0 left-0 bg-erniegreen h-screen w-full z-[20] bg-opacity-70 p-6 flex flex-col justify-center">
      <div className="p-6 bg-erniemint w-full rounded-lg flex flex-col items-end gap-4">
        <img
          src="/cross.svg"
          className="w-3 align cursor-pointer"
          onClick={() => {
            close();
          }}
        ></img>
        <div className="bg-erniecream w-full rounded-lg flex flex-col">
          <div className="p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <p className="font-circe font-[900] text-lg text-erniegreen uppercase">
                {getDate(order.date)}
              </p>
              <img src="/divider.png" className="w-full"></img>
              <div className="flex flex-row justify-between gap-2">
                <p className="font-circular text-erniegreen text-sm italic">
                  Order {order.orderNumber}
                </p>
                <p className="font-circular text-erniegreen text-sm italic">
                  {order.status}
                </p>
              </div>
              <div className="flex flex-col">
                {order.lineItems.nodes.map((item, index) => (
                  <div
                    className="flex flex-row justify-between w-full"
                    key={index}
                  >
                    <p className="font-circular text-erniegreen text-sm font-[900]">
                      {item.product.node.name}
                    </p>
                    <p className="font-circular text-erniegreen text-sm font-[900]">
                      {item.quantity}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
