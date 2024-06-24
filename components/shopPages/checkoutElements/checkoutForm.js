import {
  CardElement,
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { gql, useMutation } from "@apollo/client";
import { Source } from "@stripe/stripe-js";
import graphqlClient from "@/apollo-client";
import { useState } from "react";

export default function CheckoutForm({
  billing,
  shipping,
  basket,
  customer,
  orderComplete,
  setOrderComplete,
  employerUser,
  setOrderDetails,
  purchaseType,
  billingPeriod,
  billingInterval,
}) {
  const stripe = useStripe();

  const appearance = {
    theme: "flat",
    variables: {
      colorBackground: "#0570de",
    },
  };
  const elements = useElements({ appearance });

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

  async function handleSubmit(event) {
    event.preventDefault();

    let lineItems = [];

    console.log(basket);

    for (let i = 0; i < basket.length; i++) {
      lineItems.push({
        name: basket[i].product.name,
        productId: basket[i].product.databaseId,
        quantity: basket[i].quantity,
      });
    }

    console.log(lineItems);

    if (purchaseType == 0) {
      try {
        const source = await handleStripe();

        await checkout({
          variables: {
            input: {
              paymentMethod: "stripe",
              lineItems: lineItems,
              customerId: parseInt(employerUser),
              customerNote: "Ernie App Order",
              billing: billing,
              shipping: shipping,
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
    <form
      onSubmit={handleSubmit}
      className="h-full flex flex-col gap-4 justify-between"
    >
      <div className="relative flex flex-col gap-4 bg-erniecream p-2 rounded-lg">
        <CardElement
          options={{
            style: {
              base: {
                fontFamily: "var(--font-circularstd)",
                fontSize: "16px",
                backgroundColor: "#FFFFEC",
              },
            },
            hidePostalCode: true,
          }}
        />
      </div>
      <button
        disabled={!stripe}
        className="bg-erniegold w-[calc(100%-48px)] py-2 text-erniegreen font-circe font-[900] text-xl rounded-xl absolute bottom-6 left-0 mx-6"
      >
        Pay
      </button>
    </form>
  );
}
