export default function MyOrders({ userQuantity, nextDelivery, backAction }) {
  return (
    <div className="flex flex-col flex-grow px-4 py-12 gap-4 bg-erniecream h-full">
      <div
        className="absolute top-0 left-0 p-6 bg-erniemint w-full"
        onClick={backAction}
      >
        <img src="/left-arrow.svg" className="w-6"></img>
      </div>
      <p className="uppercase font-circe font-[900] text-4xl text-erniegreen mt-16">
        My Orders
      </p>
      <img src="/divider.png" className="h-1.5 w-full"></img>
      <div className="grid grid-cols-1 gap-4">
        <div className="flex flex-col gap-2">
          <p className="font-circular text-erniegreen font-[500] text-lg">
            Total Delivered Containers
          </p>
          <p className="uppercase font-circe font-[900] text-4xl text-erniegreen">
            {userQuantity}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-circular text-erniegreen font-[500] text-lg">
            Upcoming Delivery
          </p>
          <p className="uppercase font-circe font-[900] text-4xl text-erniegreen">
            {nextDelivery ? nextDelivery : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}
