import { useEffect, useState } from "react";
import Image from "next/image";
import { gql } from "@apollo/client";
import CheckoutForm from "../shopPages/checkoutElements/checkoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useMutation } from "@apollo/client";
import graphqlClient from "@/apollo-client";

export const Basket = ({
  addToSubBasket,
  addToOneOffBasket,
  updateSubBasket,
  updateOneOffBasket,
  clearSubBasket,
  clearOneOffBasket,
  setNewSubFrequency,
  newSubFreq,
  subBasket,
  oneOffBasket,
  purchaseType,
  hasSubscription,
  customerId,
  setSubscriptions,
  setHasSubscription,
  subscriptions,
  managingSubscription,
  updatePlanFrequency,
  updatePlan,
  orderComplete,
  setOrderComplete,
  orderDetails,
  setOrderDetails,
  showingBasket,
  setShowingBasket,
}) => {
  const stripePromise = loadStripe(
    "pk_test_51O0NO7LwuJxcpy0DUCBdVnyXLjG6MSeqeHo8Z14rufA6W77rc6wkGqTvbPVHGpI3JSLl2z5yvCCxQfcS9CrdXWxq008NvyqULO"
  );

  const [showingCheckout, setShowingCheckout] = useState(false);

  useEffect(() => {
    console.log("complete");
  }, [orderComplete]);

  const [businessName, setBusinessName] = useState("");
  const [sAddress, setSAddress] = useState("");
  const [bAddress, setBAddress] = useState("");
  const [sPostcode, setSPostcode] = useState("");
  const [bPostcode, setBPostcode] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  const [businessNameError, setBusinessNameError] = useState(false);
  const [sAddressError, setSAddressError] = useState(false);
  const [bAddressError, setBAddressError] = useState(false);
  const [sPostcodeError, setSPostcodeError] = useState(false);
  const [bPostcodeError, setBPostcodeError] = useState(false);
  const [contactNumberError, setContactNumberError] = useState(false);

  const decSubQuantity = (index) => {
    let subBasketCopy = [...subBasket];

    if (subBasketCopy[index].quantity > 1) {
      subBasketCopy[index].quantity = subBasketCopy[index].quantity - 1;
    }

    updateSubBasket(subBasketCopy);
  };

  const incSubQuantity = (index) => {
    let subBasketCopy = [...subBasket];

    subBasketCopy[index].quantity = subBasketCopy[index].quantity + 1;

    updateSubBasket(subBasketCopy);
  };

  const decOneOffQuantity = (index) => {
    let oneOffBasketCopy = [...oneOffBasket];

    if (oneOffBasketCopy[index].quantity > 1) {
      oneOffBasketCopy[index].quantity = oneOffBasketCopy[index].quantity - 1;
    }

    updateOneOffBasket(oneOffBasketCopy);
  };

  const incOneOffQuantity = (index) => {
    let oneOffBasketCopy = [...oneOffBasket];

    oneOffBasketCopy[index].quantity = oneOffBasketCopy[index].quantity + 1;

    updateOneOffBasket(oneOffBasketCopy);
  };

  const getSubSubtotal = () => {
    let subtotal = 0;

    for (let i = 0; i < subBasket.length; i++) {
      subtotal =
        subtotal +
        parseFloat(subBasket[i].product.price.replace("£", "")) *
          subBasket[i].quantity;
    }

    return subtotal;
  };

  const getCurSubSubTotal = () => {
    let subtotal = 0;

    let arr = [];

    arr = subscriptions?.data?.subscription?.subscription?.lineItems?.nodes;

    if (arr?.length > 0) {
      for (let i = 0; i < arr.length; i++) {
        subtotal =
          subtotal +
          parseFloat(arr[i].product.node.price.replace("£", "")) *
            arr[i].quantity;
      }
    }

    return subtotal;
  };

  const getOneOffSubtotal = () => {
    let subtotal = 0;

    for (let i = 0; i < oneOffBasket.length; i++) {
      subtotal =
        subtotal +
        parseFloat(oneOffBasket[i].product.price.replace("£", "")) *
          oneOffBasket[i].quantity;
    }

    return subtotal;
  };

  const [subAdjBasket, setSubAdjBasket] = useState([]);

  const NEWORDER = gql`
    mutation newOrder($input: CreateOrderInput!) {
      createOrder(input: $input) {
        orderId
        order {
          databaseId
          id
          total
        }
      }
    }
  `;

  const ADDSUBSCRIPTION = gql`
    mutation MyMutation($input: CreateSubscriptionInput!) {
      createSubscription(input: $input) {
        subscription {
          databaseId
          lineItems {
            nodes {
              databaseId
              quantity
              product {
                node {
                  name
                  description(format: RAW)
                  databaseId
                  featuredImage {
                    node {
                      sourceUrl
                    }
                  }
                }
              }
            }
          }
          billingPeriod
          billingInterval
          nextPaymentDate
        }
      }
    }
  `;

  const [checkout] = useMutation(NEWORDER, {
    client: graphqlClient,
  });

  const [addSubscription] = useMutation(ADDSUBSCRIPTION, {
    client: graphqlClient,
  });

  const [processingOrder, setProcessingOrder] = useState(false);

  function handleSubmit(event) {
    setProcessingOrder(true);

    console.log(contactNumber);

    if (businessName == "") {
      setBusinessNameError(true);
      setProcessingOrder(false);

      scrollToTop();

      return;
    } else {
      setBusinessNameError(false);
    }

    if (sAddress == "") {
      setSAddressError(true);
      setProcessingOrder(false);

      scrollToTop();

      return;
    } else {
      setSAddressError(false);
    }

    if (bAddress == "") {
      setBAddressError(true);
      setProcessingOrder(false);

      scrollToTop();

      return;
    } else {
      setBAddressError(false);
    }

    if (sPostcode == "") {
      setSPostcodeError(true);
      setProcessingOrder(false);

      scrollToTop();

      return;
    } else {
      setSPostcodeError(false);
    }

    if (bPostcode == "") {
      setBPostcodeError(true);
      setProcessingOrder(false);

      scrollToTop();

      return;
    } else {
      setBPostcodeError(false);
    }

    if (contactNumber == "") {
      setContactNumberError(true);
      setProcessingOrder(false);

      console.log("error");

      scrollToTop();

      return;
    } else {
      setContactNumberError(false);
    }

    event.preventDefault();

    let lineItems = [];

    let basket = [];

    if (purchaseType == 0) {
      basket = oneOffBasket;
    } else {
      basket = subBasket;
    }

    for (let i = 0; i < basket.length; i++) {
      lineItems.push({
        name: basket[i].product.name,
        productId: basket[i].product.databaseId,
        quantity: basket[i].quantity,
      });
    }

    console.log(lineItems);

    console.log(purchaseType);

    if (purchaseType == 0) {
      try {
        checkout({
          variables: {
            input: {
              paymentMethod: "bacs",
              lineItems: lineItems,
              customerId: parseInt(customerId),
              customerNote: "Ernie App Order",
              billing: {
                address1: bAddress,
                company: businessName,
                postcode: bPostcode,
                phone: contactNumber,
              },
              shipping: {
                address1: sAddress,
                company: businessName,
                postcode: sPostcode,
                phone: contactNumber,
              },
            },
          },
        })
          .then((data) => {
            console.log("Order Received (", data, ")");

            setOrderComplete(true);
            setOrderDetails(data);
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.error("hi", error);
      }
    } else {
      try {
        console.log(interval);
        console.log(period);
        console.log(customerId);
        console.log(lineItems);

        addSubscription({
          variables: {
            input: {
              paymentMethod: "bacs",
              lineItems: lineItems,
              customerId: parseInt(customerId),
              customerNote: "Ernie App Order",
              billing: {
                address1: bAddress,
                company: businessName,
                postcode: bPostcode,
                phone: contactNumber,
              },
              shipping: {
                address1: sAddress,
                company: businessName,
                postcode: sPostcode,
                phone: contactNumber,
              },
              billingInterval: interval + "",
              billingPeriod: "month",
            },
          },
        })
          .then((data) => {
            console.log("New Subscription (", data, ")");

            setOrderComplete(true);
            setOrderDetails(data);
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    }
  }

  const backAction = () => {
    setShowingCheckout(false);
  };

  const paymentOptions = [
    { image: "/Visa_Inc._logo.svg", name: "stripe" },
    // { image: "/Paypal.svg" },
    // { image: "/Apple_Pay_logo.svg" },
    // { image: "/Google_Pay_Logo.svg" },
    { image: "/erniesmall.svg", name: "bacs" },
  ];

  const [selectedPayment, setSelectedPayment] = useState(-1);

  const [ping, setPing] = useState(false);

  const [showBillingAddress, setShowBillingAddress] = useState(true);

  useEffect(() => {
    let basketIndicator = document.getElementById("indicator");

    basketIndicator.classList.toggle("animate-ping-once");

    setTimeout(() => {
      basketIndicator.classList.remove("animate-ping-once");
    }, 1000);
  }, [subBasket]);

  const [interval, setInterval] = useState(
    parseInt(subscriptions.data?.subscription?.subscription?.billingInterval)
  );
  const [period, setPeriod] = useState(
    subscriptions.data?.subscription?.subscription?.billingPeriod
  );

  useEffect(() => {
    setInterval(
      parseInt(subscriptions.data?.subscription?.subscription?.billingInterval)
    );
    setPeriod(subscriptions.data?.subscription?.subscription?.billingPeriod);
  }, [subscriptions]);

  const isBrowser = () => typeof window !== "undefined"; //The approach recommended by Next.js

  function scrollToTop() {
    if (!isBrowser()) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const setOrderCompleteFromBasket = (val) => {
    setOrderComplete(val);
  };

  useEffect(() => {
    setProcessingOrder(false);
  }, [orderComplete]);

  return (
    <div className="flex flex-col justify-center z-[999]">
      <div className="relative">
        <img
          id="indicator"
          src="/ERNIE_APP_ICON_CART_V1.png"
          className="w-10"
          onClick={() => setShowingBasket(!showingBasket)}
        ></img>
        <p className="font-circular text-erniecream absolute left-1/2 translate-x-[-50%] -translate-y-[27px] pointer-events-none">
          {purchaseType == 0
            ? oneOffBasket.length
            : purchaseType == 1
            ? subBasket?.length
            : 0}
        </p>
      </div>
      {console.log(purchaseType)}
      {showingBasket && (
        <>
          {showingCheckout ? (
            <div>
              {orderComplete ? (
                <div className="absolute right-0 top-20 h-full w-full bg-erniedarkcream px-6 z-[999] pb-6 flex flex-col gap-4 pt-6">
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
                        {managingSubscription ? "Subscription " : "Order "}{" "}
                        Number: {console.log(orderDetails)}
                        {/*                         
                        {purchaseType == 0
                          ? orderDetails.data.createOrder.order.databaseId
                          : orderDetails.data.createSubscription.subscription
                              .orderNumber} */}
                      </p>
                      {purchaseType == 0 && (
                        <p className="font-circular font-[400] text-erniegreen">
                          Order Total:{" "}
                          {/* {orderDetails.data.createOrder.order.total} */}
                        </p>
                      )}
                    </div>
                  </div>
                  <div
                    className="bg-erniegold py-2 w-full rounded-xl"
                    onClick={() => {
                      setOrderComplete(false);

                      if (!managingSubscription) {
                        if (purchaseType == 0) {
                          clearOneOffBasket();

                          setShowingBasket(false);
                        } else {
                          clearSubBasket();

                          let data = {
                            data: {
                              subscription: {
                                subscription:
                                  orderDetails.data.createSubscription
                                    .subscription,
                              },
                            },
                          };

                          console.log(data);

                          setSubscriptions(data);
                          setShowingBasket(false);
                          setHasSubscription(true);
                        }
                      } else {
                        clearSubBasket();

                        let data = {
                          data: {
                            subscription: {
                              subscription: orderDetails.data
                                .addProductToSubscription
                                ? orderDetails.data.addProductToSubscription
                                    ?.subscription
                                : orderDetails.data
                                    .removeProductFromSubscription
                                    ?.subscription,
                            },
                          },
                        };

                        console.log(data);

                        setSubscriptions(data);
                        setShowingBasket(false);
                        setHasSubscription(true);
                      }
                    }}
                  >
                    <p className="font-circe font-[900] text-erniegreen text-xl text-center">
                      Continue Browsing
                    </p>
                  </div>
                </div>
              ) : (
                <div className="absolute right-0 top-20 h-auto w-full bg-erniedarkcream px-6 z-[999] pb-6 flex flex-col gap-4">
                  <div
                    className="py-2 flex flex-row items-center gap-1 border-b-[1px] border-erniegreen cursor-pointer"
                    onClick={() => {
                      backAction();
                    }}
                  >
                    <div className="h-3 w-3 relative">
                      <Image
                        src="/left-arrow.svg"
                        fill={true}
                        className="h-6"
                      ></Image>
                    </div>
                    <p className="font-circular font-[500] text-center text-sm text-erniegreen">
                      Back
                    </p>
                  </div>
                  <div className="bg-erniecream rounded-xl p-6 flex flex-col">
                    <p className="font-circe text-xl text-erniegreen font-[900] uppercase">
                      Your Details
                    </p>
                    <img src="/divider.png" className=" w-full mt-2"></img>
                    <div className="flex flex-col gap-4 mt-4">
                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="businessname"
                          className={`font-circular ${
                            businessNameError
                              ? "text-red-400"
                              : "text-erniegreen"
                          } text-sm font-[500]`}
                        >
                          Name of Company *
                        </label>
                        <input
                          type="text"
                          name="businessname"
                          onChange={(e) => {
                            setBusinessName(e.currentTarget.value);
                          }}
                          className={`bg-erniecream h-10 font-circular font-[500] px-4 text-erniegreen border-[1px] ${
                            businessNameError
                              ? "border-red-400"
                              : "border-erniegreen"
                          } rounded-lg outline-erniegold outline-[1px]`}
                        ></input>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="sAddress"
                          className={`font-circular text-sm font-[500] ${
                            sAddressError ? "text-red-400" : "text-erniegreen"
                          }`}
                        >
                          Shipping Address *
                        </label>
                        <input
                          type="text"
                          name="sAddress"
                          onChange={(e) => {
                            setSAddress(e.currentTarget.value);
                            if (showBillingAddress) {
                              setBAddress(e.currentTarget.value);
                            }
                          }}
                          className={`bg-erniecream h-10 font-circular font-[500] px-4 text-erniegreen border-[1px] ${
                            sAddressError
                              ? "border-red-400"
                              : "border-erniegreen"
                          } rounded-lg outline-erniegold outline-[1px]`}
                        ></input>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="sPostcode"
                          className={`font-circular ${
                            sPostcodeError ? "text-red-400" : "text-erniegreen"
                          } text-sm font-[500]`}
                        >
                          Postcode *
                        </label>
                        <input
                          type="text"
                          name="sPostcode"
                          onChange={(e) => {
                            setSPostcode(e.currentTarget.value);
                            if (showBillingAddress) {
                              setBPostcode(e.currentTarget.value);
                            }
                          }}
                          className={`bg-erniecream h-10 font-circular font-[500] px-4 text-erniegreen border-[1px] ${
                            sPostcodeError
                              ? "border-red-400"
                              : "border-erniegreen"
                          } rounded-lg outline-erniegold outline-[1px]`}
                        ></input>
                      </div>
                      <div className="flex flex-row gap-2">
                        <label
                          htmlFor="isAddressSame"
                          className="font-circular font-[500] text-erniegreen text-sm"
                        >
                          Is this the same as the shipping address?
                        </label>
                        <input
                          type="checkbox"
                          name="isAddressSame"
                          className="w-6 h-6 bg-erniecream border-[1px] border-erniegreen rounded-sm outline-none appearance-none checked:bg-erniegold"
                          checked={showBillingAddress}
                          onChange={(e) => {
                            setShowBillingAddress(!showBillingAddress);
                          }}
                        ></input>
                      </div>
                      {!showBillingAddress && (
                        <>
                          <div className="flex flex-col gap-2">
                            <label
                              htmlFor="bAddress"
                              className={`font-circular ${
                                bAddressError
                                  ? "text-red-400"
                                  : "text-erniegreen"
                              } text-sm font-[500]`}
                            >
                              Billing Address *
                            </label>
                            <input
                              type="text"
                              name="bAddress"
                              onChange={(e) => {
                                setBAddress(e.currentTarget.value);
                              }}
                              defaultValue={!showBillingAddress && sAddress}
                              className={`bg-erniecream h-10 font-circular font-[500] px-4 text-erniegreen border-[1px] ${
                                bAddressError
                                  ? "border-red-400"
                                  : "border-erniegreen"
                              } rounded-lg outline-erniegold outline-[1px]`}
                            ></input>
                          </div>
                          <div className="flex flex-col gap-2">
                            <label
                              htmlFor="bPostcode"
                              className={`font-circular ${
                                bPostcode ? "text-red-400" : "text-erniegreen"
                              } text-sm font-[500]`}
                            >
                              Postcode *
                            </label>
                            <input
                              type="text"
                              name="bPostcode"
                              onChange={(e) => {
                                setBPostcode(e.currentTarget.value);
                              }}
                              defaultValue={!showBillingAddress && sPostcode}
                              className={`bg-erniecream h-10 font-circular font-[500] px-4 text-erniegreen border-[1px] ${
                                bPostcodeError
                                  ? "border-red-400"
                                  : "border-erniegreen"
                              } rounded-lg outline-erniegold outline-[1px]`}
                            ></input>
                          </div>
                        </>
                      )}
                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="contactnumber"
                          className={`font-circular ${
                            contactNumberError
                              ? "text-red-400"
                              : "text-erniegreen"
                          } text-sm font-[500]`}
                        >
                          Contact Number *
                        </label>
                        <input
                          type="text"
                          name="contactnumber"
                          onChange={(e) => {
                            setContactNumber(e.currentTarget.value);
                          }}
                          className={`bg-erniecream h-10 font-circular font-[500] px-4 text-erniegreen border-[1px] ${
                            contactNumberError
                              ? "border-red-400"
                              : "border-erniegreen"
                          } rounded-lg outline-erniegold outline-[1px]`}
                        ></input>
                      </div>
                    </div>
                  </div>
                  <div className="bg-erniecream rounded-xl p-6 flex flex-col">
                    <p className="font-circe text-xl text-erniegreen font-[900] uppercase">
                      Vouchers & Discounts
                    </p>
                    <img src="/divider.png" className=" w-full mt-2"></img>
                    <div className="flex flex-col gap-4 mt-4">
                      <div className="flex flex-col gap-2">
                        <input
                          type="text"
                          name="voucher"
                          placeholder="Enter code here"
                          onChange={(e) => {
                            // setRBusinessName(e.currentTarget.value);
                          }}
                          className="bg-erniecream h-10 font-circular font-[500] px-4 text-erniegreen border-[1px] border-erniegreen rounded-lg outline-erniegold outline-[1px]"
                        ></input>
                      </div>
                    </div>
                  </div>
                  {!managingSubscription && (
                    <div className="bg-erniecream rounded-xl p-6 flex flex-col">
                      <p className="font-circe text-xl text-erniegreen font-[900] uppercase">
                        Payment Options
                      </p>
                      <img src="/divider.png" className=" w-full mt-2"></img>
                      <div className="flex flex-col gap-2 mt-4">
                        {paymentOptions.map((option, index) => (
                          <div className="" key={index}>
                            <div
                              className={`flex flex-row justify-between p-2 rounded-lg ${
                                selectedPayment == index
                                  ? "bg-erniedarkcream rounded"
                                  : "border-[1px] border-erniegreen"
                              }`}
                              onClick={() => {
                                setSelectedPayment(index);
                              }}
                            >
                              <img className="h-6" src={option.image} />
                              <p className="font-circular text-erniegreen">
                                {">"}
                              </p>
                            </div>
                            {selectedPayment == index && (
                              <>
                                {index == 0 && (
                                  <div className="bg-erniedarkcream p-4">
                                    {console.log(period)}
                                    <Elements stripe={stripePromise}>
                                      <CheckoutForm
                                        basket={oneOffBasket}
                                        employerUser={customerId}
                                        billing={{
                                          address1: bAddress,
                                          company: businessName,
                                          postcode: bPostcode,
                                          phone: contactNumber,
                                        }}
                                        shipping={{
                                          address1: sAddress,
                                          company: businessName,
                                          postcode: sPostcode,
                                          phone: contactNumber,
                                        }}
                                        setOrderComplete={
                                          setOrderCompleteFromBasket
                                        }
                                        setOrderDetails={setOrderDetails}
                                        purchaseType={purchaseType}
                                        billingInterval={interval}
                                        billingPeriod={period}
                                        setProcessingOrder={setProcessingOrder}
                                        setBAddressError={setBAddressError}
                                        setBPostcodeError={setBPostcodeError}
                                        setBusinessNameError={
                                          setBusinessNameError
                                        }
                                        setContactNumberError={
                                          setContactNumberError
                                        }
                                        setSAddressError={setSAddressError}
                                        setSPostcodeError={setSPostcodeError}
                                        bAddress={bAddress}
                                        sAddress={sAddress}
                                        bPostcode={bPostcode}
                                        sPostcode={sPostcode}
                                        contactNumber={contactNumber}
                                        businessName={businessName}
                                        scrollToTop={scrollToTop}
                                        processingOrder={processingOrder}
                                      />
                                    </Elements>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="bg-erniecream rounded-xl p-6 flex flex-col">
                    <p className="font-circe text-xl text-erniegreen font-[900] uppercase">
                      Order Summary
                    </p>
                    <img src="/divider.png" className=" w-full mt-2"></img>
                    <div className="flex flex-col gap-1 mt-4">
                      {subBasket.map((item, index) => (
                        <div
                          className="w-full grid grid-cols-4 items-center"
                          key={index}
                        >
                          <p className="font-circular text-erniegreen col-span-2 text-sm">
                            {item.product.name}
                          </p>
                          <p className="font-circular text-erniegreen text-sm">
                            £
                            {(
                              parseFloat(item.product.price.replace("£", "")) *
                              item.quantity
                            ).toFixed(2)}
                          </p>
                          <div className="flex flex-row gap-2 items-center justify-end">
                            <p className="font-circular text-erniegreen text-right">
                              {item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                      {oneOffBasket.map((item, index) => (
                        <div
                          className="w-full grid grid-cols-4 items-center"
                          key={index}
                        >
                          <p className="font-circular text-erniegreen col-span-2 text-sm">
                            {item.product.name}
                          </p>
                          <p className="font-circular text-erniegreen text-sm">
                            £
                            {(
                              parseFloat(item.product.price.replace("£", "")) *
                              item.quantity
                            ).toFixed(2)}
                          </p>
                          <div className="flex flex-row gap-2 items-center justify-end">
                            <p className="font-circular text-erniegreen text-right">
                              {item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                      {purchaseType == 1 && (
                        <p className="font-circular font-[500] text-erniegreen text-right">
                          {period == "week" && interval == 1
                            ? "Every week"
                            : period == "week" && interval == 2
                            ? "Every other week"
                            : period == "month" && interval == 1
                            ? "Every month"
                            : period == "month" && interval == 2
                            ? "Every other month"
                            : ""}
                        </p>
                      )}
                    </div>
                  </div>
                  <div
                    className="bg-erniegold rounded-xl w-full p-2 flex flex-row justify-center items-center"
                    onClick={(e) => {
                      if (managingSubscription) {
                        console.log(subAdjBasket);

                        updatePlan(subAdjBasket);
                        // updatePlanFrequency({
                        //   id: subscriptions.data.subscription.subscription
                        //     .databaseId,
                        //   billingInterval: interval + "",
                        //   billingPeriod: period,
                        // });
                        setProcessingOrder(true);
                      } else {
                        handleSubmit(e);
                      }
                    }}
                  >
                    {processingOrder && (
                      <svg
                        className={`animate-spin -ml-1 mr-3 h-5 w-5 text-erniegreen`}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          stroke-width="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    )}

                    <p
                      className={`font-circe font-[900] text-erniegreen text-center text-lg`}
                    >
                      {managingSubscription ? "Update Subscription" : "Pay Now"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="absolute right-0 top-20 h-[calc(88vh-80px)] w-full bg-erniedarkcream px-6 z-[999] py-6 flex flex-col gap-4 overflow-auto">
              {subBasket.length == 0 && oneOffBasket.length == 0 ? (
                <p className="font-circular text-erniegreen text-center">
                  Your basket is currently empty
                </p>
              ) : purchaseType == 0 && oneOffBasket.length == 0 ? (
                <p className="font-circular text-erniegreen text-center">
                  Your basket is currently empty
                </p>
              ) : purchaseType == 1 && subBasket.length == 0 ? (
                <p className="font-circular text-erniegreen text-center">
                  Your basket is currently empty
                </p>
              ) : (
                <>
                  {(hasSubscription || subBasket.length != 0) &&
                    purchaseType == 1 && (
                      <>
                        {managingSubscription && (
                          <div className="bg-erniecream rounded-xl p-6 flex flex-col">
                            <p className="font-circe text-xl text-erniegreen font-[900] uppercase">
                              Current Subscription
                            </p>
                            <img
                              src="/divider.png"
                              className="w-fill mt-2"
                            ></img>
                            <div className="flex flex-col gap-1 mt-4">
                              {subscriptions.data.subscription.subscription.lineItems.nodes.map(
                                (item, index) => (
                                  <div
                                    className="w-full grid grid-cols-4 items-center"
                                    key={index}
                                  >
                                    <p className="font-circular text-erniegreen col-span-2 text-sm">
                                      {item.product.node.name}
                                    </p>
                                    <p className="font-circular text-erniegreen col-span-1 text-sm">
                                      {item.product.node.price}
                                    </p>
                                    <p className="font-circular text-erniegreen col-span-1 text-sm text-right">
                                      {item.quantity}
                                    </p>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                        <div className="bg-erniecream rounded-xl p-6 flex flex-col">
                          <p className="font-circe text-xl text-erniegreen font-[900] uppercase">
                            Add To Subscription
                          </p>
                          {console.log(subscriptions)}
                          <img
                            src="/divider.png"
                            className=" w-full mt-2"
                          ></img>

                          <div className="flex flex-col gap-1 mt-4">
                            {subBasket.map((item, index) => (
                              <div
                                className="w-full grid grid-cols-4 items-center"
                                key={index}
                              >
                                <p className="font-circular text-erniegreen col-span-2 text-sm">
                                  {item.product.name}
                                </p>
                                <p className="font-circular text-erniegreen text-sm">
                                  £
                                  {(
                                    parseFloat(
                                      item.product.price.replace("£", "")
                                    ) * item.quantity
                                  ).toFixed(2)}
                                </p>
                                <div className="flex flex-row gap-2 items-center justify-end">
                                  <div
                                    className="flex flex-col justify-center items-center border-[1px] border-erniegreen rounded-full aspect-[1/1] p-1 min-w-[22px] max-h-[20px] cursor-pointer"
                                    onClick={() => decSubQuantity(index)}
                                  >
                                    <img
                                      src="/remove-green.svg"
                                      className="w-3 h-3"
                                    ></img>
                                  </div>
                                  <p className="font-circular text-erniegreen text-right">
                                    {item.quantity}
                                  </p>
                                  <div
                                    className="flex flex-col justify-center items-center border-[1px] border-erniegreen rounded-full aspect-[1/1] p-1 min-w-[22px] max-h-[20px] cursor-pointer"
                                    onClick={() => incSubQuantity(index)}
                                  >
                                    <img
                                      src="/add-green.svg"
                                      className="w-3 h-3"
                                    ></img>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="bg-erniecream rounded-xl p-6 flex flex-col">
                          <p className="font-circe text-xl text-erniegreen font-[900] uppercase">
                            Subscription Frequency
                          </p>
                          <img
                            src="/divider.png"
                            className=" w-full mt-2"
                          ></img>
                          {managingSubscription && (
                            <p className="font-circular text-erniegreen font-[500] text-sm mt-2">
                              Note: This is change your entire subscriptions
                              frequency.
                            </p>
                          )}
                          <select
                            name="frequency"
                            onChange={(e) => {
                              setNewSubFrequency(e.target.value.toUpperCase());

                              console.log(e.target.value);
                              switch (e.target.value) {
                                case "weekly":
                                  setInterval(1);
                                  setPeriod("week");
                                  break;
                                case "bi-weekly":
                                  setInterval(2);
                                  setPeriod("week");
                                  break;
                                case "monthly":
                                  setInterval(1);
                                  setPeriod("month");
                                  break;
                                case "bi-monthly":
                                  setInterval(2);
                                  setPeriod("month");
                                  break;
                              }
                            }}
                            className="mt-4 border-[1px] border-erniegreen bg-erniecream rounded-lg font-circular px-2 py-2 text-erniegreen text-sm font-[500]"
                          >
                            <option
                              value="weekly"
                              selected={
                                subscriptions.data.subscription.subscription
                                  ? subscriptions.data.subscription.subscription
                                      ?.billingPeriod == "week" &&
                                    subscriptions.data.subscription.subscription
                                      .billingInterval == "1"
                                  : true
                              }
                            >
                              Weekly
                            </option>
                            <option
                              value="bi-weekly"
                              selected={
                                subscriptions.data.subscription.subscription
                                  ?.billingPeriod == "week" &&
                                subscriptions.data.subscription.subscription
                                  .billingInterval == "2"
                              }
                            >
                              {"Bi-weekly (once every two weeks)"}
                            </option>
                            <option
                              value="monthly"
                              selected={
                                subscriptions.data.subscription.subscription
                                  ?.billingPeriod == "month" &&
                                subscriptions.data.subscription.subscription
                                  .billingInterval == "1"
                              }
                            >
                              Monthly
                            </option>
                            <option
                              value="bi-monthly"
                              selected={
                                subscriptions.data.subscription.subscription
                                  ?.billingPeriod == "month" &&
                                subscriptions.data.subscription.subscription
                                  .billingInterval == "2"
                              }
                            >
                              {"Bi-monthly (once every two months)"}
                            </option>
                          </select>
                        </div>
                      </>
                    )}
                  {oneOffBasket.length != 0 && purchaseType == 0 && (
                    <div className="bg-erniecream rounded-xl p-6 flex flex-col">
                      <p className="font-circe text-xl text-erniegreen font-[900] uppercase">
                        My One Off Basket
                      </p>
                      <img src="/divider.png" className=" w-full mt-2"></img>
                      <div className="flex flex-col mt-4 gap-1">
                        {oneOffBasket.map((item, index) => (
                          <div
                            className="w-full grid grid-cols-4 items-center"
                            key={index}
                          >
                            <p className="font-circular text-erniegreen col-span-2 text-sm">
                              {item.product.name}
                            </p>
                            <p className="font-circular text-erniegreen text-sm">
                              £
                              {(
                                parseFloat(
                                  item.product.price.replace("£", "")
                                ) * item.quantity
                              ).toFixed(2)}
                            </p>
                            <div className="flex flex-row gap-2 items-center justify-end">
                              <div
                                className="flex flex-col justify-center items-center border-[1px] border-erniegreen rounded-full aspect-[1/1] p-1 min-w-[22px] max-h-[20px] cursor-pointer"
                                onClick={() => decOneOffQuantity(index)}
                              >
                                <img
                                  src="/remove-green.svg"
                                  className="w-3 h-3"
                                ></img>
                              </div>
                              <p className="font-circular text-erniegreen text-right">
                                {item.quantity}
                              </p>
                              <div
                                className="flex flex-col justify-center items-center border-[1px] border-erniegreen rounded-full aspect-[1/1] p-1 min-w-[22px] max-h-[20px] cursor-pointer"
                                onClick={() => incOneOffQuantity(index)}
                              >
                                <img
                                  src="/add-green.svg"
                                  className="w-3 h-3"
                                ></img>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
              <div className="bg-erniecream rounded-xl p-6 flex flex-col">
                <p className="font-circular font-[900] text-erniegreen">
                  Subtotal
                </p>

                {managingSubscription && (
                  <div className="flex flex-row justify-between mt-2">
                    <p className="font-circular text-erniegreen text-sm">
                      Current subscription
                    </p>

                    <p className="font-circular font-[900] text-erniegreen text-sm">
                      £{getCurSubSubTotal().toFixed(2)}
                    </p>
                  </div>
                )}
                {purchaseType == 1 && (
                  <div className="flex flex-row justify-between mt-2">
                    <p className="font-circular text-erniegreen text-sm">
                      {managingSubscription
                        ? "New items"
                        : "Subscription items"}
                    </p>

                    <p className="font-circular font-[900] text-erniegreen text-sm">
                      £{getSubSubtotal().toFixed(2)}
                    </p>
                  </div>
                )}
                {purchaseType == 0 && (
                  <div className="flex flex-row justify-between">
                    <p className="font-circular text-erniegreen text-sm">
                      One off items
                    </p>
                    <p className="font-circular font-[900] text-erniegreen text-sm">
                      £{getOneOffSubtotal().toFixed(2)}
                    </p>
                  </div>
                )}

                <div className="w-full h-[1px] bg-erniegreen mt-4"></div>
                <div className="flex flex-row justify-between mt-4">
                  <p className="font-circular text-erniegreen text-sm">
                    Delivery Fee
                  </p>
                  <p className="font-circular text-erniegreen text-sm">
                    {parseFloat(getCurSubSubTotal().toFixed(2)) +
                      parseFloat(getSubSubtotal().toFixed(2)) <
                    80.0
                      ? "£8.95"
                      : "FREE"}
                  </p>
                </div>
                <div className="flex flex-row justify-between mt-2">
                  <p className="font-circular font-[900] text-erniegreen">
                    Total
                  </p>
                  <p className="font-circular font-[900] text-erniegreen text-sm">
                    £
                    {managingSubscription
                      ? (
                          parseFloat(getCurSubSubTotal().toFixed(2)) +
                          parseFloat(getSubSubtotal().toFixed(2)) +
                          (parseFloat(getCurSubSubTotal().toFixed(2)) +
                            parseFloat(getSubSubtotal().toFixed(2)) <
                          80.0
                            ? 8.95
                            : 0.0)
                        ).toFixed(2)
                      : purchaseType == 0
                      ? getOneOffSubtotal().toFixed(2)
                      : getSubSubtotal().toFixed(2)}
                  </p>
                </div>
                <p className="font-circular tedt-erniegreen italic text-sm text-right">
                  Every {interval == 2 && "other"} {period}
                </p>
              </div>
              {subBasket.length == 0 && oneOffBasket.length == 0 ? (
                <></>
              ) : (
                <div
                  className={`bg-erniegold rounded-xl w-full p-2 ${
                    hasSubscription
                      ? "opacity-100 cursor-pointer"
                      : purchaseType != -1
                      ? "opacity-100 cursor-pointer"
                      : "opacity-50"
                  }`}
                  onClick={() => {
                    if (purchaseType == 1) {
                      setShowingCheckout(true);

                      let tempSubAdj = [];

                      let arr = [];

                      arr =
                        subscriptions?.data?.subscription?.subscription
                          ?.lineItems?.nodes;

                      if (managingSubscription) {
                        if (arr?.length > 0) {
                          for (let i = 0; i < arr.length; i++) {
                            tempSubAdj.push(arr[i]);
                          }

                          for (let j = 0; j < subBasket.length; j++) {
                            tempSubAdj.push({
                              product: { node: subBasket[j].product },
                              quantity: subBasket[j].quantity,
                            });
                          }
                        }

                        console.log(tempSubAdj);

                        setSubAdjBasket(tempSubAdj);
                      }
                    } else {
                      setShowingCheckout(true);
                    }
                  }}
                >
                  <p className="font-circe font-[900] text-erniegreen text-center text-lg">
                    Checkout
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
