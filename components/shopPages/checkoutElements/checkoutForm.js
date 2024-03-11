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

  console.log(customer);

  const [checkout] = useMutation(CHECKOUT, {
    client: graphqlClient,
    onCompleted({ checkout }) {
      console.log("Order Received (", checkout, ")");

      setOrderComplete();
    },
    onError(error) {
      console.error(error);
    },
  });

  async function handleSubmit(event) {
    event.preventDefault();

    let lineItems = [];

    console.log(basket);

    for (let i = 0; i < basket.length; i++) {
      lineItems.push({
        productId: basket[i].databaseId,
        quantity: basket[i].qty,
      });
    }

    console.log(lineItems);

    try {
      const source = await handleStripe();

      await checkout({
        variables: {
          input: {
            paymentMethod: "stripe",
            lineItems: lineItems,
            customerId: parseInt(employerUser),
            customerNote:
              customer.billing.firstName + " " + customer.billing.lastName,
            metaData: [
              {
                key: `_stripe_source_id`,
                value: source.id,
              },
            ],
          },
        },
      });
    } catch (error) {
      console.error("hi", error);
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
      <div className="border-2 border-erniegreen px-4 py-6 relative flex flex-col gap-4">
        <p className="absolute left-1 -top-[22px] font-circe font-[900] text-lg uppercase text-erniegreen bg-erniecream p-2">
          Payment
        </p>
        <CardElement
          options={{
            style: {
              base: {
                fontFamily: "var(--font-circularstd)",
                fontSize: "16px",
              },
            },
            hidePostalCode: true,
          }}
        />
      </div>
      <button
        disabled={!stripe}
        className="bg-erniegreen w-full h-14 text-erniecream font-circe uppercase font-[900] text-lg"
      >
        Pay
      </button>
    </form>
  );
}
