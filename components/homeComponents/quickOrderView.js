export const QuickOrderView = ({ close, subscriptions, orders }) => {
  return (
    <div className="absolute top-0 bg-erniegreen h-screen w-full z-[20] bg-opacity-70 p-6 flex flex-col justify-center">
      <div className="p-6 bg-erniemint w-full rounded-lg flex flex-col items-end gap-4">
        <img
          src="/cross.svg"
          className="w-3 align cursor-pointer"
          onClick={() => {
            close();
          }}
        ></img>
        <div className="bg-erniecream p-6 w-full rounded-lg flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="font-circe font-[900] text-lg text-erniegreen uppercase">
              My Subscription
            </p>
            <img src="/divider.png" className="w-full"></img>
          </div>
          <div className="flex flex-col gap-2">
            {subscriptions.data.subscription.subscription.lineItems.nodes.map(
              (lineItem, index) => (
                <div className="flex flex-row justify-between" key={index}>
                  <p className="font-circular text-sm font-[500] text-erniegreen">
                    {lineItem.product.node.name}
                  </p>
                  <p className="font-circular text-sm font-[500] text-erniegreen">
                    {lineItem.quantity}
                  </p>
                </div>
              )
            )}
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-circe font-[900] text-erniegreen uppercase">
              My One Off Purchases
            </p>
            <img src="/divider.png" className="w-full"></img>
          </div>
          <div className="flex flex-col gap-2 max-h-32 overflow-auto">
            {orders.map((lineItem, index) => (
              <div className="flex flex-row justify-between" key={index}>
                <p className="font-circular text-sm font-[500] text-erniegreen">
                  {lineItem.product?.node.name}
                </p>
                <p className="font-circular text-sm font-[500] text-erniegreen">
                  {lineItem.quantity}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
