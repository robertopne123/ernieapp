import { useEffect, useState } from "react";
import Image from "next/image";
import { gql } from "@apollo/client";
import CheckoutForm from "../shopPages/checkoutElements/checkoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useMutation } from "@apollo/client";
import graphqlClient from "@/apollo-client";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";

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
  coupons,
  products,
}) => {
  const stripePromise = loadStripe(
    "pk_live_51Pglrw2Kqe9gzhhxqUyBOvx7Zfyn7z51eC6170fBY07jjDRD6wro4hyDYtvjfQyOwhxAxsGLFV6X0N8UMqo40n4d00LXY8HJl4"
  );

  const [showingCheckout, setShowingCheckout] = useState(false);

  useEffect(() => {
    console.log("complete");
  }, [orderComplete]);

  const [businessName, setBusinessName] = useState(
    localStorage.getItem("companyname")
  );
  const [sAddress, setSAddress] = useState(localStorage.getItem("address"));
  const [bAddress, setBAddress] = useState(localStorage.getItem("address"));
  const [sPostcode, setSPostcode] = useState(localStorage.getItem("postcode"));
  const [bPostcode, setBPostcode] = useState(localStorage.getItem("postcode"));
  const [contactNumber, setContactNumber] = useState(
    localStorage.getItem("number")
  );

  const [businessNameError, setBusinessNameError] = useState(false);
  const [sAddressError, setSAddressError] = useState(false);
  const [bAddressError, setBAddressError] = useState(false);
  const [sPostcodeError, setSPostcodeError] = useState(false);
  const [bPostcodeError, setBPostcodeError] = useState(false);
  const [contactNumberError, setContactNumberError] = useState(false);

  const [donationAmount, setDonationAmount] = useState(0.0);
  const [voucherAmount, setVoucherAmount] = useState(0.0);
  const [deliveryAmount, setDeliveryAmount] = useState(0.0);

  const [voucher, setVoucher] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState("");
  const [voucherApplied, setVoucherApplied] = useState(false);
  const [voucherFound, setVoucherFound] = useState(false);
  const [voucherInvalid, setVoucherInvalid] = useState(false);
  const [voucherInvalidMsg, setVoucherInvalidMsg] = useState("");
  const [matchedProduct, setMatchedProduct] = useState(-1);
  const [mProducts, setMProducts] = useState([]);

  const router = useRouter();

  const decSubQuantity = (index) => {
    let subBasketCopy = [...subBasket];

    if (subBasketCopy[index].quantity > 1) {
      subBasketCopy[index].quantity = subBasketCopy[index].quantity - 1;
    } else if (subBasketCopy[index].quantity == 1) {
      subBasketCopy.splice(index, 1);
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
    } else if (oneOffBasketCopy[index].quantity == 1) {
      oneOffBasketCopy.splice(index, 1);
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

  const [url, setUrl] = useState("");

  function handleSubmit() {
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
      console.log(basket[i]);

      if (mProducts.length > 0) {
        if (
          basket[i].product.databaseId ==
          mProducts[mProducts.length - 1]?.databaseId
        ) {
          if (basket[i].quantity > 1) {
            for (let j = 0; j < basket[i].quantity; j++) {
              lineItems.push({
                name: basket[i].product.name,
                productId: basket[i].product.databaseId,
                quantity: basket[i].quantity,
              });
            }
          }
        }
      }

      lineItems.push({
        name: basket[i].product.name,
        productId: basket[i].product.databaseId,
        quantity: basket[i].quantity,
      });
    }

    if (addDonation) {
      lineItems.push({
        name: "Groundswell Donation",
        productId: 3723,
        quantity: parseInt(donationAmount),
      });
    }

    console.log(lineItems);

    console.log(purchaseType);

    let mId =
      purchaseType == 0
        ? parseFloat(getOneOffSubtotal().toFixed(2)) < 80.0
          ? "flat_rate"
          : "free_shipping"
        : managingSubscription
        ? parseFloat(getCurSubSubTotal().toFixed(2)) +
            parseFloat(getSubSubtotal().toFixed(2)) <
          80.0
          ? "flat_rate"
          : "free_shipping"
        : parseFloat(getSubSubtotal().toFixed(2)) < 80.0
        ? "flat_rate"
        : "free_shipping";

    let mTitle =
      purchaseType == 0
        ? parseFloat(getOneOffSubtotal().toFixed(2)) < 80.0
          ? "Flat Rate"
          : "Free Shipping"
        : managingSubscription
        ? parseFloat(getCurSubSubTotal().toFixed(2)) +
            parseFloat(getSubSubtotal().toFixed(2)) <
          80.0
          ? "Flat Rate"
          : "Free Shipping"
        : parseFloat(getSubSubtotal().toFixed(2)) < 80.0
        ? "Flat Rate"
        : "Free Shipping";

    let total =
      purchaseType == 0
        ? parseFloat(getOneOffSubtotal().toFixed(2)) < 80.0
          ? "8.95"
          : "0.0"
        : managingSubscription
        ? parseFloat(getCurSubSubTotal().toFixed(2)) +
            parseFloat(getSubSubtotal().toFixed(2)) <
          80.0
          ? "8.95"
          : "0.0"
        : parseFloat(getSubSubtotal().toFixed(2)) < 80.0
        ? "8.95"
        : "0.0";

    if (purchaseType == 0) {
      try {
        checkout({
          variables: {
            input: {
              paymentMethod: "bacs",
              lineItems: lineItems,
              customerId: parseInt(customerId),
              customerNote: "Ernie App Order",
              coupons: appliedVoucher,
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
              shippingLines: [
                {
                  methodId: mId,
                  methodTitle: mTitle,
                  total: appliedVoucher == "FREECOFFEE" ? "0.0" : total,
                },
              ],
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
        console.log(mId);
        console.log(mTitle);
        console.log(total);
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
              shippingLines: [
                {
                  methodId: mId,
                  methodTitle: mTitle,
                  total: total,
                },
              ],
              billingInterval: interval + "",
              billingPeriod: period,
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
    setVoucherApplied(false);
  };

  const pathname = usePathname();

  const paymentOptions = [
    // { image: "/Visa_Inc._logo.svg", name: "stripe" },
    // { image: "/Paypal.svg" },
    // { image: "/Apple_Pay_logo.svg" },
    // { image: "/Google_Pay_Logo.svg" },
    { image: "/erniesmall.svg", name: "bacs" },
  ];

  const [selectedPayment, setSelectedPayment] = useState(0);

  const [ping, setPing] = useState(false);

  const [showBillingAddress, setShowBillingAddress] = useState(true);

  const [addDonation, setDonation] = useState(false);

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
      parseInt(
        subscriptions.data?.subscription?.subscription?.billingInterval
          ? subscriptions.data?.subscription?.subscription?.billingInterval
          : 1
      )
    );
    setPeriod(
      subscriptions.data?.subscription?.subscription?.billingPeriod
        ? subscriptions.data?.subscription?.subscription?.billingPeriod
        : "week"
    );
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

  useEffect(() => {
    if (managingSubscription) {
      if (voucherApplied && appliedVoucher == "FREECOFFEE") {
        setDeliveryAmount(0.0);

        for (let i = 0; i < subAdjBasket.length; i++) {
          console.log(subAdjBasket[i]);
        }

        setVoucherAmount(
          parseFloat(
            subAdjBasket[subAdjBasket.length - 1]?.product.price.replace(
              "£",
              ""
            )
          ) * -1
        );
      } else {
        if (
          parseFloat(getCurSubSubTotal().toFixed(2)) +
            parseFloat(getSubSubtotal().toFixed(2)) <
          80.0
        ) {
          setDeliveryAmount(8.95);
          setVoucherAmount(0.0);
        } else {
          setDeliveryAmount(0.0);
          setVoucherAmount(0.0);
        }
      }
    } else {
      if (purchaseType == 0) {
        if (voucherApplied) {
          let currentVoucher = {};

          for (let i = 0; i < coupons.length; i++) {
            if (coupons[i].code == appliedVoucher.toLowerCase()) {
              currentVoucher = coupons[i];
            }
          }

          console.log(currentVoucher);

          if (currentVoucher.freeShipping) {
            setDeliveryAmount(0.0);
          } else {
            setDeliveryAmount(8.95);
          }

          for (let i = 0; i < oneOffBasket.length; i++) {
            console.log(oneOffBasket[i]);
          }

          setVoucherAmount(
            parseFloat(
              oneOffBasket[oneOffBasket.length - 1]?.product.price.replace(
                "£",
                ""
              )
            ) * -1
          );
        } else {
          if (parseFloat(getOneOffSubtotal().toFixed(2)) < 80.0) {
            setDeliveryAmount(8.95);
            setVoucherAmount(0.0);
          } else {
            setDeliveryAmount(0.0);
            setVoucherAmount(0.0);
          }
        }
      } else {
        if (voucherApplied && appliedVoucher == "FREECOFFEE") {
          setDeliveryAmount(0.0);

          for (let i = 0; i < subAdjBasket.length; i++) {
            console.log(subAdjBasket[i]);
          }

          setVoucherAmount(
            parseFloat(
              subAdjBasket[subAdjBasket.length - 1]?.product.price.replace(
                "£",
                ""
              )
            ) * -1
          );
        } else {
          if (parseFloat(getSubSubtotal().toFixed(2)) < 80.0) {
            setDeliveryAmount(8.95);
            setVoucherAmount(0.0);
          } else {
            setDeliveryAmount(0.0);
            setVoucherAmount(0.0);
          }
        }
      }
    }
  }, [
    subAdjBasket,
    getCurSubSubTotal,
    getSubSubtotal,
    voucher,
    voucherApplied,
    managingSubscription,
    oneOffBasket,
    getOneOffSubtotal,
    purchaseType,
    coupons,
    appliedVoucher,
  ]);

  useEffect(() => {
    if (addDonation) {
    } else {
      setDonationAmount(0.0);
    }
  }, [addDonation]);

  useEffect(() => {
    console.log(mProducts);

    let higher = 0.0;
    let location = 0;

    for (let i = 0; i < mProducts.length; i++) {
      if (
        (
          parseFloat(mProducts[i].product.price.replace("£", "")) *
          mProducts[i].quantity
        ).toFixed(2) > higher
      ) {
        higher = (
          parseFloat(mProducts[i].product.price.replace("£", "")) *
          mProducts[i].quantity
        ).toFixed(2);
        location = i;
      }
    }

    console.log(higher);

    setMatchedProduct(location);
  }, [mProducts]);

  return (
    <div className="flex flex-col justify-center z-[999]">
      <div className="relative cursor-pointer hover:bg-erniemint p-2 mr-[-8px]">
        {console.log(oneOffBasket)}
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
                        {console.log(orderDetails)}
                        Number:{" "}
                        {purchaseType == 1
                          ? managingSubscription
                            ? orderDetails.subscriptions.data.subscription
                                .subscription.databaseId
                            : orderDetails.data.createSubscription.subscription
                                .databaseId
                          : 0}
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

                        let data = orderDetails;
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
                          defaultValue={businessName}
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
                          defaultValue={sAddress}
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
                          defaultValue={sPostcode}
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
                          Is this the same as the billing address?
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
                              defaultValue={bAddress}
                              onChange={(e) => {
                                setBAddress(e.currentTarget.value);
                              }}
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
                              defaultValue={bPostcode}
                              onChange={(e) => {
                                setBPostcode(e.currentTarget.value);
                              }}
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
                          defaultValue={contactNumber}
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
                      Coupons & Discounts
                    </p>
                    <img src="/divider.png" className=" w-full mt-2"></img>
                    <div className="flex flex-col gap-4 mt-4">
                      <div className="flex flex-col gap-2">
                        <input
                          type="text"
                          name="voucher"
                          placeholder="Enter code here"
                          onChange={(e) => {
                            setVoucher(e.currentTarget.value);
                          }}
                          onPaste={(e) => {
                            setVoucher(e.currentTarget.value);
                          }}
                          className={`bg-erniecream h-10 font-circular font-[500] px-4 text-erniegreen border-[1px] rounded-lg outline-erniegold outline-[1px] ${
                            voucherInvalid
                              ? "border-red-500"
                              : voucherApplied
                              ? "border-ernieteal"
                              : "border-erniegreen"
                          }`}
                        ></input>
                      </div>
                      {voucherApplied && (
                        <div className="flex flex-row">
                          <div
                            className="p-2 bg-erniedarkcream flex flex-row gap-2 rounded-lg cursor-pointer"
                            onClick={(e) => {
                              setVoucherApplied(false);
                            }}
                          >
                            <p className="font-circular text-erniegreen text-xs font-[500]">
                              {appliedVoucher}
                            </p>
                            <img src="/cross.svg" className="w-3"></img>
                          </div>
                        </div>
                      )}
                      {voucherInvalid && (
                        <div className="flex flex-row">
                          <p className="font-circular text-red-500 text-xs font-[500]">
                            {voucherInvalidMsg}
                          </p>
                        </div>
                      )}
                      <div
                        className={`bg-erniegold rounded-xl w-full p-2 flex flex-row justify-center items-center cursor-pointer`}
                        onClick={(e) => {
                          console.log(voucher);

                          console.log(coupons);

                          console.log(oneOffBasket);

                          let vFound = false;

                          let productsForCode = [];

                          for (let i = 0; i < coupons.length; i++) {
                            if (coupons[i].code == voucher.toLowerCase()) {
                              console.log(
                                coupons[i].code,
                                voucher.toLowerCase()
                              );
                              if (coupons[i].limitUsageToXItems == 1) {
                                if (purchaseType == 0) {
                                  productsForCode = coupons[i].products.nodes;

                                  let matchingProducts = [];

                                  for (
                                    let a = 0;
                                    a < productsForCode.length;
                                    a++
                                  ) {
                                    for (
                                      let b = 0;
                                      b < oneOffBasket.length;
                                      b++
                                    ) {
                                      console.log(
                                        productsForCode[a].databaseId,
                                        oneOffBasket[b].product.databaseId
                                      );
                                      if (
                                        productsForCode[a].databaseId ==
                                        oneOffBasket[b].product.databaseId
                                      ) {
                                        matchingProducts.push(oneOffBasket[b]);
                                        break;
                                      } else {
                                      }
                                    }
                                  }

                                  console.log(matchingProducts);

                                  if (matchingProducts.length > 0) {
                                    console.log(purchaseType);
                                    setVoucherApplied(true);
                                    setVoucherFound(true);
                                    vFound = true;
                                    setVoucherInvalid(false);
                                    setAppliedVoucher(voucher);
                                    console.log(matchingProducts);
                                    setMProducts(matchingProducts);
                                  } else {
                                    console.log("sub");
                                    console.log(purchaseType);
                                    setVoucherApplied(false);
                                    setVoucherFound(true);
                                    vFound = true;
                                    setVoucherInvalid(true);
                                    setVoucherInvalidMsg(
                                      "You have no valid items in your basket"
                                    );
                                  }
                                } else {
                                  console.log("sub");
                                  console.log(purchaseType);
                                  setVoucherApplied(false);
                                  setVoucherFound(true);
                                  vFound = true;
                                  setVoucherInvalid(true);
                                  setVoucherInvalidMsg(
                                    "This coupon can only be applied to one-off orders"
                                  );
                                }
                              } else {
                                console.log(coupons[i].limitUsageToXItems);
                                setVoucherApplied(true);
                                setVoucherFound(true);
                                vFound = true;
                                setVoucherInvalid(false);
                                setAppliedVoucher(voucher);

                                productsForCode = coupons[i].products.nodes;

                                let matchingProducts = [];

                                for (
                                  let a = 0;
                                  a < productsForCode.length;
                                  a++
                                ) {
                                  for (
                                    let b = 0;
                                    b < oneOffBasket.length;
                                    b++
                                  ) {
                                    console.log(
                                      productsForCode[a].databaseId,
                                      oneOffBasket[b].product.databaseId
                                    );
                                    if (
                                      productsForCode[a].databaseId ==
                                      oneOffBasket[b].product.databaseId
                                    ) {
                                      matchingProducts.push(oneOffBasket[b]);
                                    }
                                  }
                                }

                                console.log(matchingProducts);

                                if (matchingProducts.length > 0) {
                                  console.log(purchaseType);
                                  setVoucherApplied(true);
                                  setVoucherFound(true);
                                  vFound = true;
                                  setVoucherInvalid(false);
                                  setAppliedVoucher(voucher);
                                } else {
                                  console.log("sub");
                                  console.log(purchaseType);
                                  setVoucherApplied(false);
                                  setVoucherFound(true);
                                  vFound = true;
                                  setVoucherInvalid(true);
                                  setVoucherInvalidMsg(
                                    "You have no valid items in your basket"
                                  );
                                }
                              }

                              break;
                            } else {
                              continue;
                            }
                          }

                          if (!vFound) {
                            console.log(voucher);
                            setVoucherInvalid(true);
                            setVoucherInvalidMsg("Invalid coupon");
                            setVoucherApplied(false);
                          }
                        }}
                      >
                        <p
                          className={`font-circe font-[900] text-erniegreen text-center text-lg`}
                        >
                          Apply Voucher
                        </p>
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
                            </div>
                            {selectedPayment == index && (
                              <>
                                {/* {index == 0 && (
                                  <div className="bg-erniedarkcream">
                                    {console.log(period)}
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
                                      shippingLines={[
                                        {
                                          methodId:
                                            purchaseType == 0
                                              ? parseFloat(
                                                  getOneOffSubtotal().toFixed(2)
                                                ) < 80.0
                                                ? "flat_rate"
                                                : "free_shipping"
                                              : managingSubscription
                                              ? parseFloat(
                                                  getCurSubSubTotal().toFixed(2)
                                                ) +
                                                  parseFloat(
                                                    getSubSubtotal().toFixed(2)
                                                  ) <
                                                80.0
                                                ? "flat_rate"
                                                : "free_shipping"
                                              : parseFloat(
                                                  parseFloat(
                                                    getSubSubtotal().toFixed(2)
                                                  ) < 80.0
                                                    ? "flat_rate"
                                                    : "free_shipping"
                                                ),
                                          methodTitle:
                                            purchaseType == 0
                                              ? parseFloat(
                                                  getOneOffSubtotal().toFixed(2)
                                                ) < 80.0
                                                ? "Flat Rate"
                                                : "Free Shipping"
                                              : managingSubscription
                                              ? parseFloat(
                                                  getCurSubSubTotal().toFixed(2)
                                                ) +
                                                  parseFloat(
                                                    getSubSubtotal().toFixed(2)
                                                  ) <
                                                80.0
                                                ? "Flat Rate"
                                                : "Free Shipping"
                                              : parseFloat(
                                                  parseFloat(
                                                    getSubSubtotal().toFixed(2)
                                                  ) < 80.0
                                                    ? "Flat Rate"
                                                    : "Free Shipping"
                                                ),
                                          total:
                                            purchaseType == 0
                                              ? parseFloat(
                                                  getOneOffSubtotal().toFixed(2)
                                                ) < 80.0
                                                ? "8.95"
                                                : "0.0"
                                              : managingSubscription
                                              ? parseFloat(
                                                  getCurSubSubTotal().toFixed(2)
                                                ) +
                                                  parseFloat(
                                                    getSubSubtotal().toFixed(2)
                                                  ) <
                                                80.0
                                                ? "8.95"
                                                : "0.0"
                                              : parseFloat(
                                                  parseFloat(
                                                    getSubSubtotal().toFixed(2)
                                                  ) < 80.0
                                                    ? "8.95"
                                                    : "0.0"
                                                ),
                                        },
                                      ]}
                                      shippingTotal={
                                        purchaseType == 0
                                          ? parseFloat(
                                              getOneOffSubtotal().toFixed(2)
                                            ) < 80.0
                                            ? "8.95"
                                            : "0.0"
                                          : managingSubscription
                                          ? parseFloat(
                                              getCurSubSubTotal().toFixed(2)
                                            ) +
                                              parseFloat(
                                                getSubSubtotal().toFixed(2)
                                              ) <
                                            80.0
                                            ? "8.95"
                                            : "0.0"
                                          : parseFloat(
                                              parseFloat(
                                                getSubSubtotal().toFixed(2)
                                              ) < 80.0
                                                ? "8.95"
                                                : "0.0"
                                            )
                                      }
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
                                      setUrl={setUrl}
                                      currentUrl={router.asPath}
                                      managingSubscription={
                                        managingSubscription
                                      }
                                      orderDetails={orderDetails}
                                    />
                                  </div>
                                )} */}
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
                      <div className="w-full h-[1px] bg-erniegreen mt-4"></div>
                      <div className="flex flex-row justify-between mt-4">
                        <p className="font-circular text-erniegreen text-sm">
                          Delivery Fee
                        </p>
                        <p className="font-circular text-erniegreen text-sm">
                          £{deliveryAmount.toFixed(2)}
                        </p>
                      </div>
                      {addDonation && (
                        <div className="flex flex-row justify-between mt-2">
                          <p className="font-circular text-erniegreen text-sm">
                            Donation
                          </p>
                          <p className="font-circular text-erniegreen text-sm">
                            £{donationAmount.toFixed(2)}
                          </p>
                        </div>
                      )}
                      {voucherApplied && (
                        <div className="flex flex-row justify-between mt-2">
                          <p className="font-circular text-erniegreen text-sm font-[500]">
                            DISCOUNT: {appliedVoucher}
                          </p>
                          <p className="font-circular text-erniegreen text-sm">
                            -
                            {purchaseType == 0 &&
                              mProducts[matchedProduct]?.product.price}
                          </p>
                          {console.log(matchedProduct)}
                        </div>
                      )}
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
                                parseFloat(deliveryAmount.toFixed(2)) +
                                parseFloat(donationAmount.toFixed(2)) +
                                parseFloat(voucherAmount.toFixed(2))
                              ).toFixed(2)
                            : purchaseType == 0
                            ? (
                                parseFloat(getOneOffSubtotal().toFixed(2)) +
                                parseFloat(deliveryAmount.toFixed(2)) +
                                parseFloat(donationAmount.toFixed(2)) +
                                parseFloat(voucherAmount.toFixed(2))
                              ).toFixed(2)
                            : (
                                parseFloat(getSubSubtotal().toFixed(2)) +
                                parseFloat(deliveryAmount.toFixed(2)) +
                                parseFloat(donationAmount.toFixed(2)) +
                                parseFloat(voucherAmount.toFixed(2))
                              ).toFixed(2)}
                        </p>
                      </div>
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
                  {console.log(subAdjBasket)}
                  <div
                    className={`bg-erniegold rounded-xl w-full p-2 flex flex-row justify-center items-center cursor-pointer`}
                    onClick={(e) => {
                      if (managingSubscription) {
                        console.log(donationAmount);
                        console.log(addDonation);

                        console.log(products);

                        let donationProduct = {};

                        for (let i = 0; i < products.length; i++) {
                          if (products[i].databaseId == 3723) {
                            donationProduct = products[i];
                          }
                        }

                        if (addDonation) {
                          subAdjBasket.push({
                            product: { node: donationProduct },
                            quantity: donationAmount,
                          });
                        }

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
                        handleSubmit();
                      }
                    }}
                  >
                    {console.log(selectedPayment)}
                    {processingOrder && (
                      <svg
                        className={`animate-spin -ml-1 mr-3 h-5 w-5 text-erniegreen `}
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
                          {purchaseType == 1 && (
                            <p className="font-circular text-erniegreen font-[500] text-sm mt-2">
                              Note: This is change your entire subscriptions
                              frequency.
                            </p>
                          )}
                          <select
                            name="frequency"
                            disabled={managingSubscription}
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
                          {managingSubscription && (
                            <p className="font-circular text-red-500 font-[500] text-xs mt-2">
                              The subscription can only be adjusted by visiting
                              Manage Plan
                            </p>
                          )}
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
              <div className="bg-ernieteal rounded-xl p-6 flex flex-col">
                <img
                  src="/groundswellimg.jpg"
                  className="bg-groundswell w-36 p-2 object-cover rounded-lg"
                ></img>
                <p className="font-circe font-[900] uppercase text-erniecream text-xl mt-4">
                  Donate to Groundswell
                </p>

                <p className="font-circular font-[500] text-erniecream">
                  Add a £1 donation to Groundswell to your order
                </p>
                <div className="flex flex-row mt-2 items-center gap-2">
                  <div className="grid grid-cols-4 gap-2 w-full">
                    <div className="flex flex-row gap-2 relative">
                      <label
                        htmlFor="donation"
                        className="font-circular text-erniegreen text-sm font-[500] absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] w-full text-center pointer-events-none"
                      >
                        £0.00
                      </label>
                      <input
                        type="radio"
                        name="donation"
                        defaultChecked={true}
                        className="bg-erniecream border-[1px] border-erniegreen appearance-none flex w-full checked:bg-erniegold checked:border-erniegold rounded-lg h-10 cursor-pointer"
                        value={"0.0"}
                        onChange={(e) => {
                          setDonation(false);
                          setDonationAmount(0.0);
                        }}
                      ></input>
                    </div>
                    <div className="flex flex-row gap-2 relative">
                      <label
                        htmlFor="donation"
                        className="font-circular text-erniegreen text-sm font-[500] absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] w-full text-center pointer-events-none"
                      >
                        £1.00
                      </label>
                      <input
                        type="radio"
                        name="donation"
                        className="bg-erniecream border-[1px] border-erniegreen appearance-none flex w-full checked:bg-erniegold checked:border-erniegold rounded-lg h-10 cursor-pointer"
                        value={"1.0"}
                        onChange={(e) => {
                          setDonation(true);
                          setDonationAmount(1.0);
                        }}
                      ></input>
                    </div>
                    <div className="flex flex-row gap-2 relative">
                      <label
                        htmlFor="donation"
                        className="font-circular text-erniegreen text-sm font-[500] absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] w-full text-center pointer-events-none"
                      >
                        £2.00
                      </label>
                      <input
                        type="radio"
                        name="donation"
                        className="bg-erniecream border-[1px] border-erniegreen appearance-none flex w-full checked:bg-erniegold checked:border-erniegold rounded-lg h-10 cursor-pointer"
                        value={"2.0"}
                        onChange={(e) => {
                          setDonation(true);
                          setDonationAmount(2.0);
                        }}
                      ></input>
                    </div>
                    <div className="flex flex-row gap-2 relative">
                      <label
                        htmlFor="donation"
                        className="font-circular text-erniegreen text-sm font-[500] absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] w-full text-center pointer-events-none"
                      >
                        £5.00
                      </label>
                      <input
                        type="radio"
                        name="donation"
                        className="bg-erniecream border-[1px] border-erniegreen appearance-none flex w-full checked:bg-erniegold checked:border-erniegold rounded-lg h-10 cursor-pointer"
                        value={"5.0"}
                        onChange={(e) => {
                          setDonation(true);
                          setDonationAmount(5.0);
                        }}
                      ></input>
                    </div>
                  </div>
                </div>
              </div>
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
                    £{deliveryAmount.toFixed(2)}
                  </p>
                </div>
                {addDonation && (
                  <div className="flex flex-row justify-between mt-2">
                    <p className="font-circular text-erniegreen text-sm">
                      Donation
                    </p>
                    <p className="font-circular text-erniegreen text-sm">
                      £{donationAmount.toFixed(2)}
                    </p>
                  </div>
                )}
                {voucherApplied && (
                  <div className="flex flex-row justify-between mt-2">
                    <p className="font-circular text-erniegreen text-sm font-[500]">
                      DISCOUNT: {appliedVoucher}
                    </p>
                    <p className="font-circular text-erniegreen text-sm">
                      -
                      {purchaseType == 0 &&
                        oneOffBasket[oneOffBasket.length - 1]?.product?.price}
                    </p>
                  </div>
                )}

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
                          parseFloat(deliveryAmount.toFixed(2)) +
                          parseFloat(donationAmount.toFixed(2)) +
                          parseFloat(voucherAmount.toFixed(2))
                        ).toFixed(2)
                      : purchaseType == 0
                      ? (
                          parseFloat(getOneOffSubtotal().toFixed(2)) +
                          parseFloat(deliveryAmount.toFixed(2)) +
                          parseFloat(donationAmount.toFixed(2)) +
                          parseFloat(voucherAmount.toFixed(2))
                        ).toFixed(2)
                      : (
                          parseFloat(getSubSubtotal().toFixed(2)) +
                          parseFloat(deliveryAmount.toFixed(2)) +
                          parseFloat(donationAmount.toFixed(2)) +
                          parseFloat(voucherAmount.toFixed(2))
                        ).toFixed(2)}
                  </p>
                </div>
                {purchaseType == 1 && (
                  <p className="font-circular tedt-erniegreen italic text-sm text-right">
                    Every {interval == 2 && "other"} {period}
                  </p>
                )}
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
