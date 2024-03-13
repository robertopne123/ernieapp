import Image from "next/image";
import { useState } from "react";
import { Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./checkoutElements/checkoutForm";

export default function Checkout({
  backAction,
  basket,
  subsidy,
  customer,
  setBasket,
  setBasketCount,
  setSelectedIndex,
  setAlert,
  setShowingAlert,
  setShowingCheckout,
  setShowingBasket,
  employerUser,
}) {
  const stripePromise = loadStripe(
    "pk_test_51O0NO7LwuJxcpy0DUCBdVnyXLjG6MSeqeHo8Z14rufA6W77rc6wkGqTvbPVHGpI3JSLl2z5yvCCxQfcS9CrdXWxq008NvyqULO"
  );

  const getFloatPrice = (price) => {
    let symbolRemoved = price.replace("£", "");

    return parseFloat(symbolRemoved);
  };

  const getBasketTotal = () => {
    let total = 0.0;

    for (let i = 0; i < basket.length; i++) {
      total =
        parseFloat(total) +
        parseFloat(basket[i].qty * getFloatPrice(basket[i].price));
    }

    return total.toFixed(2);
  };

  const [alertMessage, setAlertMessage] = useState("");

  const [alertAction, setAlertAction] = useState("");

  const [basketEdit, setBasketEditing] = useState(-1);

  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertAction(type);

    setShowingAlert(true);
  };

  const closeAlert = () => {
    setShowingAlert(false);
  };

  const clearBasket = () => {
    setBasket([]);
  };

  const setAlertFromCheckoutPage = (message, type) => {
    setAlert(message, type);
  };

  const increaseQty = (index) => {
    let newBasket = basket;

    let basketObj = newBasket[index];

    basketObj.qty = basketObj.qty + 1;

    newBasket.splice(index, 1, basketObj);

    console.log(newBasket);

    setBasket([...newBasket]);

    let count = 0;

    for (let i = 0; i < basket.length; i++) {
      count = count + basket[i].qty;
    }

    setBasketCount(count);
  };

  const reduceQty = (index, category) => {
    let newBasket = basket;

    let basketObj = newBasket[index];

    console.log(category);

    if (basketObj.qty > 1) {
      basketObj.qty = basketObj.qty - 1;
    } else {
      setSelectedIndex(index);
      setAlertFromCheckoutPage(
        "Do you want to remove this item from your basket?",
        "Confirm"
      );
    }

    newBasket.splice(index, 1, basketObj);

    console.log(newBasket);

    setBasket([...newBasket]);

    let count = 0;

    for (let i = 0; i < basket.length; i++) {
      count = count + basket[i].qty;
    }

    setBasketCount(count);
  };

  const removeItem = () => {
    let newBasket = basket;

    newBasket.splice(selectedIndex);

    setBasket(newBasket);

    let count = 0;

    for (let i = 0; i < basket.length; i++) {
      count = count + basket[i].qty;
    }

    setBasketCount(count);
  };

  const [checkoutStage, setCheckoutStage] = useState(0);

  const [orderComplete, setOrderComplete] = useState(false);

  const setOrderCompleteFromCheckout = () => {
    setOrderComplete(true);
  };

  return (
    <div className="absolute left-0 top-0 flex flex-col h-full w-full overflow-auto z-20">
      <div
        className="sticky top-0 px-6 py-4 bg-erniemint w-full h-[70px] flex flex-row items-center justify-between z-20"
        onClick={backAction}
      >
        <div className="h-6 w-6 relative">
          <Image src="/left-arrow.svg" fill={true} className="h-6"></Image>
        </div>
        <p className="uppercase font-circe font-[900] text-center text-3xl line-[36px] mt-2 text-erniegreen">
          Checkout
        </p>
      </div>
      {orderComplete == false ? (
        <div className="bg-erniecream w-full z-max px-4 py-8">
          <div className="w-full h-full bg-erniecream bottom-full z-10 ">
            {basket.length == 0 ? (
              <div className="w-full h-full flex flex-col justify-center items-center">
                <p className="font-circe text-erniegreen uppercase font-[900] text-xl">
                  Your Basket Is Empty
                </p>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col gap-2">
                <div className="flex flex-row justify-end gap-2">
                  <p className="font-circe text-erniegreen uppercase font-[900]">
                    {basketEdit != 0 ? "Edit" : "Editing"}
                  </p>
                  <img
                    src="/edit-green.svg"
                    className="w-5 h-5"
                    onClick={(e) => {
                      if (basketEdit != -1) {
                        setBasketEditing(-1);
                      } else {
                        setBasketEditing(0);
                      }
                    }}
                  />
                </div>
                <img src="/divider.png" className="w-full h-2 mb-2"></img>
                <div className="w-full min-h-[30vh] flex flex-col gap-4">
                  {basket.map((basketItem, index) => (
                    <div className="flex flex-col gap-4" key={index}>
                      <div className="flex flex-row gap-4 justify-between">
                        <p className="text-erniegreen inline font-circe uppercase font-[900] text-xl flex-shrink max-w-[50%] text-ellipsis text-nowrap whitespace-nowrap overflow-hidden">
                          {basketItem.name}
                        </p>
                        <div className="flex flex-row gap-4 justify-end">
                          <p className="text-erniegreen inline font-circe uppercase font-[900] text-xl">
                            £
                            {(
                              basketItem.qty.toFixed(2) *
                              getFloatPrice(basketItem.price)
                            ).toFixed(2)}
                          </p>
                          {basketEdit != 0 && (
                            <p className="text-erniegreen inline font-circe uppercase font-[900] text-xl ">
                              {basketItem.qty}
                              <span className="text-sm ml-1">
                                {basketItem.category == "squirrel sisters"
                                  ? basketItem.qty > 1
                                    ? "boxes"
                                    : "box"
                                  : basketItem.qty > 1
                                  ? "kgs"
                                  : "kg"}
                              </span>
                            </p>
                          )}
                          {basketEdit == 0 && (
                            <div className="flex flex-row gap-2 flex-grow items-center justify-end">
                              <div
                                className="flex flex-col justify-center items-center bg-erniegreen px-2 py-1 max-w-[24px] min-w-[24px]"
                                onClick={(e) => {
                                  reduceQty(index);
                                }}
                              >
                                <img
                                  src="/remove.svg"
                                  className="w-4 h-4"
                                ></img>
                              </div>
                              <p className="text-erniegreen inline font-circe uppercase font-[900] text-xl ">
                                {basketItem.qty}
                                <span className="text-sm ml-1">
                                  {basketItem.category == "squirrel sisters"
                                    ? basketItem.qty > 1
                                      ? "boxes"
                                      : "box"
                                    : basketItem.qty > 1
                                    ? "kgs"
                                    : "kg"}
                                </span>
                              </p>
                              <div
                                className="flex flex-col justify-center items-center bg-erniegreen px-2 py-1 max-w-[24px] min-w-[24px]"
                                onClick={(e) => {
                                  increaseQty(index);
                                }}
                              >
                                <img src="/add.svg" className="w-4 h-4"></img>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <img src="/divider.png" className="w-full h-1.5 mb-4"></img>
                <div className="flex flex-row justify-end gap-2">
                  <p className="font-circe text-erniegreen font-[900] uppercase mt-1.5">
                    TOTAL
                  </p>
                  <p className="font-circe text-erniegreen font-[900] uppercase text-2xl">
                    £{getBasketTotal()}
                  </p>
                </div>
                <div className="flex flex-row justify-end gap-2">
                  <p className="font-circe text-erniegreen font-[900] uppercase mt-1.5">
                    SUBSIDY ({subsidy?.amount ? subsidy.amount : subsidy}%)
                  </p>
                  <p className="font-circe text-erniegreen font-[900] uppercase text-2xl">
                    £
                    {(
                      (subsidy?.amount ? subsidy.amount : subsidy) *
                      0.01 *
                      getBasketTotal()
                    ).toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-row justify-end gap-2 pb-2">
                  <p className="font-circe text-erniegreen font-[900] uppercase mt-1.5">
                    SUBTOTAL
                  </p>
                  <p className="font-circe text-erniegreen font-[900] uppercase text-2xl">
                    £
                    {(
                      getBasketTotal() -
                      (
                        (subsidy?.amount ? subsidy.amount : subsidy) *
                        0.01 *
                        getBasketTotal()
                      ).toFixed(2)
                    ).toFixed(2)}
                  </p>
                </div>
                <img src="/divider.png" className="w-full h-1.5 mb-4"></img>
                <div className="bg-erniecream h-full w-full z-max flex flex-col gap-6">
                  <div className="flex flex-col">
                    <p className="font-circe text-erniegreen font-[900] uppercase text-xl">
                      Delivery To:
                    </p>
                    <p className="font-circular text-erniegreen text-base mb-2">
                      {customer.billing.company}
                      <br />
                      {customer.billing.address1}
                      {customer.billing.address2 && <br />}
                      {customer.billing.address2 != null &&
                        customer.billing.address2}
                      <br />
                      {customer.billing.city}
                      <br />
                      {customer.billing.postcode}
                    </p>
                  </div>
                  <Elements stripe={stripePromise}>
                    <CheckoutForm
                      billing={customer.billing}
                      shipping={customer.shipping}
                      basket={basket}
                      customer={customer}
                      orderComplete={orderComplete}
                      setOrderComplete={setOrderCompleteFromCheckout}
                      employerUser={employerUser}
                    />
                  </Elements>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-erniecream w-full z-max gap-4 px-4 py-8 h-full flex flex-col justify-center">
          <p className="font-circe font-erniegreen text-3xl font-[900] uppercase text-center">
            Order Complete
          </p>
          <div
            className="flex flex-row justify-center"
            onClick={(e) => {
              setShowingCheckout();
              setShowingBasket();
            }}
          >
            <div className="bg-erniegreen px-4 py-2 justify-center items-center">
              <p className="font-circe text-erniecream font-[900] uppercase">
                Continue Browsing
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
