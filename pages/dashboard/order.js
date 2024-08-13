import Router from "next/router";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";

export default function Order() {
  const searchParams = useSearchParams();
  const router = useRouter();

  let managingSubscription = searchParams.get("msub");
  let purchaseType = searchParams.get("ptype");
  let orderDetails = searchParams.get("odetails");

  return (
    <div className="absolute right-0 h-full w-full bg-erniedarkcream px-6 z-[999] pb-6 flex flex-col gap-4 pt-6">
      <p className="font-circe font-[900] text-center text-3xl  text-erniegreen">
        Thank you
      </p>
      <p className="font-circular font-[500] text-erniegreen text-center">
        {managingSubscription
          ? "Your subscription has been updated"
          : purchaseType == 0
          ? "Your one-off order is now complete"
          : "Your new subscription is now active"}
      </p>
      <div className="bg-erniecream rounded-xl p-6">
        <p className="font-circe font-[900] text-erniegreen uppercase text-xl">
          Order Details
        </p>
        <img src="/divider.png" className="w-full"></img>
        <div className="mt-2 flex flex-col">
          <p className="font-circular font-[500] text-erniegreen">
            {managingSubscription ? "Subscription " : "Order "} Number:{" "}
            {console.log(orderDetails)}
            {/*                         
              {purchaseType == 0
                ? orderDetails.data.createOrder.order.databaseId
                : orderDetails.data.createSubscription.subscription
                    .orderNumber} */}
          </p>
          {purchaseType == 0 && (
            <p className="font-circular font-[400] text-erniegreen">
              Order Total: {/* {orderDetails.data.createOrder.order.total} */}
            </p>
          )}
        </div>
      </div>
      <div
        className="bg-erniegold py-2 w-full rounded-xl"
        onClick={() => {
          //   setOrderComplete(false);

          //   if (!managingSubscription) {
          //     if (purchaseType == 0) {
          //       clearOneOffBasket();

          //       setShowingBasket(false);
          //     } else {
          //       clearSubBasket();

          //       let data = {
          //         data: {
          //           subscription: {
          //             subscription:
          //               orderDetails.data.createSubscription.subscription,
          //           },
          //         },
          //       };

          //       console.log(data);

          //       setSubscriptions(data);
          //       setShowingBasket(false);
          //       setHasSubscription(true);
          //     }
          //   } else {
          //     clearSubBasket();

          //     let data = {
          //       data: {
          //         subscription: {
          //           subscription: orderDetails.data.addProductToSubscription
          //             ? orderDetails.data.addProductToSubscription?.subscription
          //             : orderDetails.data.removeProductFromSubscription
          //                 ?.subscription,
          //         },
          //       },
          //     };

          //     console.log(data);

          //     setSubscriptions(data);
          //     setShowingBasket(false);
          //     setHasSubscription(true);
          //   }
          router.push("/dashboard");
        }}
      >
        <p className="font-circe font-[900] text-erniegreen text-xl text-center">
          Continue Browsing
        </p>
      </div>
    </div>
  );
}
