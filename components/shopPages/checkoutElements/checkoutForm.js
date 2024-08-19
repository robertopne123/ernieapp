import {
  CardElement,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
  Elements,
} from "@stripe/react-stripe-js";
import { gql, useMutation } from "@apollo/client";
import { Source } from "@stripe/stripe-js";
import graphqlClient from "@/apollo-client";
import { useState } from "react";
import { useStripe } from "@stripe/react-stripe-js";
import Stripe from "stripe";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect } from "react";
import Router from "next/router";
import { useRouter } from "next/router";

export default function CheckoutForm({
  billing,
  shipping,
  shippingLines,
  shippingTotal,
  basket,
  customer,
  orderComplete,
  setOrderComplete,
  employerUser,
  setOrderDetails,
  purchaseType,
  billingPeriod,
  billingInterval,
  setProcessingOrder,
  setBAddressError,
  setBPostcodeError,
  setBusinessNameError,
  setContactNumberError,
  setSAddressError,
  setSPostcodeError,
  bAddress,
  bPostcode,
  contactNumber,
  sAddress,
  sPostcode,
  businessName,
  scrollToTop,
  processingOrder,
  setUrl,
  currentUrl,
  managingSubscription,
  orderDetails,
}) {
  const stripePromise = loadStripe(
    "pk_live_51Pglrw2Kqe9gzhhxqUyBOvx7Zfyn7z51eC6170fBY07jjDRD6wro4hyDYtvjfQyOwhxAxsGLFV6X0N8UMqo40n4d00LXY8HJl4"
  );

  let secret = process.env.NEXT_PUBLIC_STRIPE_SECRET;

  const stripe = require("stripe")(`${secret}`);

  console.log(secret);

  const appearance = {
    theme: "flat",
    variables: {
      colorBackground: "#0570de",
    },
  };

  const setUrlFromForm = (val) => {
    setUrl(val);
  };

  const CHECKOUT = gql`
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

  console.log(customer);

  const [checkout] = useMutation(CHECKOUT, {
    client: graphqlClient,
  });

  const [addSubscription] = useMutation(ADDSUBSCRIPTION, {
    client: graphqlClient,
  });

  const [session, setSession] = useState(null);

  const [showForm, setShowForm] = useState(false);

  let router = useRouter();

  async function handleSubmit(event) {
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

    console.log(basket);

    let total = 0.0;

    for (let i = 0; i < basket.length; i++) {
      lineItems.push({
        name: basket[i].product.name,
        productId: basket[i].product.databaseId,
        quantity: basket[i].quantity,
      });

      total +=
        basket[i].quantity *
        parseFloat(basket[i].product.price.replace("£", ""));
    }

    console.log(total);

    console.log(lineItems);

    const stripe = new Stripe(`${secret}`);

    // const paymentIntent = stripe.paymentIntents.create({
    //   amount: total * 100,
    //   currency: "GBP",
    // });

    if (purchaseType == 0) {
      try {
        const source = await handleStripe();

        console.log(basket);

        await checkout({
          variables: {
            input: {
              paymentMethod: "stripe",
              lineItems: lineItems,
              customerId: parseInt(employerUser),
              customerNote: "Ernie App Order",
              billing: billing,
              shipping: shipping,
              shippingLines: shippingLines,
              metaData: [
                {
                  key: `_stripe_source_id`,
                  value: source.id,
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
        const source = await handleStripe();

        console.log(billingPeriod);
        console.log(billingInterval);
        console.log(employerUser);
        console.log(lineItems);
        console.log(billing);
        console.log(shipping);

        await addSubscription({
          variables: {
            input: {
              paymentMethod: "stripe",
              lineItems: lineItems,
              customerId: parseInt(employerUser),
              customerNote: "Ernie App Order",
              billing: billing,
              shipping: shipping,
              shippingLines: shippingLines,
              metaData: [
                {
                  key: `_stripe_source_id`,
                  value: source.id,
                },
              ],
              billingInterval: billingInterval + "",
              billingPeriod: billingPeriod,
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
      } catch (error) {}
    }
  }

  useEffect(() => {
    let line_items = [];

    for (let i = 0; i < basket.length; i++) {
      line_items.push({
        price_data: {
          currency: "gbp",
          product_data: {
            name: basket[i].product.name,
          },
          unit_amount: parseInt(
            parseFloat(basket[i].product.price.replace("£", "")) * 100
          ),
        },
        quantity: basket[i].quantity,
      });
    }

    const fetchData = async () => {
      const session = await stripe.checkout.sessions.create({
        shipping_options: [
          {
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: {
                amount: shippingTotal == "8.95" ? 895 : 0,
                currency: "gbp",
              },
              display_name: "Shipping",
            },
          },
        ],
        line_items: line_items,
        mode: "payment",
        success_url: `${
          window.location.origin
        }/dashboard/order?msub=${managingSubscription}&ptype=${purchaseType}&odetails=${JSON.stringify(
          orderDetails
        )}`,
      });

      setSession(session.url);
      setUrlFromForm(session.url);

      console.log(session);
    };

    fetchData();
  }, [basket]);

  async function handleStripe() {
    if (!stripe || !elements) {
      throw Error(`stripe or elements undefined`);
    }

    // Extract the payment data from our <CardElement/> component
    const cardElements = elements.getElement(CardElement);

    // Guard against an undefined value
    if (!cardElements) {
      throw Error(`cardElements not found`);
    }

    // Create the Source object
    const { source, error: sourceError } = await stripe.createSource(
      cardElements,
      {
        type: `card`,
      }
    );

    // Guard against and error or undefined source
    if (sourceError || !source) {
      throw Error(sourceError?.message || `Unknown error generating source`);
    }
    return source;
  }

  return (
    <form className="h-full flex flex-col gap-4 justify-between">
      <div className="relative flex flex-col gap-4 bg-erniecream rounded-lg"></div>
      <div
        className="bg-erniegold w-[calc(100%-48px)] py-2 text-erniegreen font-circe font-[900] text-lg rounded-xl absolute bottom-6 left-0 mx-6"
        onClick={(e) => {
          let path = router.asPath;

          router.push(session);

          handleSubmit(e);
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
          Pay Now
        </p>
      </div>
    </form>
  );
}
