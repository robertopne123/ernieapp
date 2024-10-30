import Image from "next/image";
import { useEffect, useState } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client";
import graphqlClient from "../../apollo-client";
import { OrderComplete } from "./orderComplete";

export const QuickOrder = ({
  backAction,
  subscriptions,
  products,
  employerUser,
  backToHome,
}) => {
  const [currentSubscription, setCurrentSubscription] = useState(
    subscriptions.data?.subscription.subscription
  );

  console.log(employerUser);

  const [orderMoreQty, setOrderMoreQty] = useState(1);

  const [basket, setBasket] = useState([]);

  const [orderComplete, setOrderComplete] = useState(false);

  const incQty = () => {
    if (orderMoreQty < 50) {
      setOrderMoreQty(orderMoreQty + 1);
    }
  };

  const decQty = () => {
    if (orderMoreQty > 1) {
      setOrderMoreQty(orderMoreQty - 1);
    }
  };

  const newIncQty = (item) => {
    let basketCopy = [...basket];

    let productFound = false;

    console.log(item);
    console.log(basket);

    for (let i = 0; i < basketCopy.length; i++) {
      if (basketCopy[i].product.name == item.name) {
        basketCopy[i].quantity++;

        productFound = true;
      }
    }

    if (!productFound) {
      basketCopy.push({ product: item, quantity: 1 });
    }

    setBasket(basketCopy);
  };

  const newDecQty = (item) => {
    let basketCopy = [...basket];

    let productFound = false;

    console.log(item);
    console.log(basketCopy);

    for (let i = 0; i < basketCopy.length; i++) {
      if (basketCopy[i].product.name == item.name) {
        if (basketCopy[i].quantity > 1) {
          basketCopy[i].quantity--;
        } else {
          basketCopy.splice(i, 1);
        }

        productFound = true;
      }
    }

    setBasket(basketCopy);
  };

  const getQty = (item) => {
    let productFound = false;

    for (let i = 0; i < basket.length; i++) {
      if (basket[i].product.name == item.name) {
        return basket[i].quantity;

        productFound = true;
      }
    }

    if (!productFound) {
      return 0;
    }
  };

  useEffect(() => {
    console.log(basket);
  }, [basket]);

  const getGroupedProducts = () => {
    let groups = [];

    let productsCopy = [...products];

    for (let i = 0; i < productsCopy.length; i++) {
      if (productsCopy[i].__typename != "SubscriptionProduct") {
        let groupFound = false;

        if (
          productsCopy[i].productTags?.nodes[0].name != "coffee machine" &&
          productsCopy[i].productTags?.nodes[0].name != "cups/bottles" &&
          productsCopy[i].productTags?.nodes[0].name != "old-products"
        ) {
          console.log("Drinks/Food");
          if (groups.length != 0) {
            //IF GROUPS EXIST
            console.log("Groups found");
            for (let j = 0; j < groups.length; j++) {
              if (
                groups[j].category == productsCopy[i].productTags?.nodes[0].name
              ) {
                console.log(
                  "Group found - " + productsCopy[i].productTags.nodes[0].name
                );
                groups[j].products.push(productsCopy[i]);
                groupFound = true;

                console.log(
                  "Product added to group - " +
                    productsCopy[i].productTags.nodes[0].name +
                    " - " +
                    productsCopy[i].name
                );

                continue;
              }
            }

            if (!groupFound) {
              let tempProducts = [];

              tempProducts.push(productsCopy[i]);

              console.log(
                "Group not found - " + productsCopy[i].productTags.nodes[0].name
              );

              groups.push({
                category: productsCopy[i].productTags.nodes[0].name,
                products: tempProducts,
                displayOrder:
                  productsCopy[i].productTags.nodes[0].tagCategoryImages
                    .displayOrder,
              });

              console.log(
                "Group added - " + productsCopy[i].productTags.nodes[0].name
              );

              groupFound = true;

              continue;
            }
          } else {
            console.log("Groups not found");

            let tempProducts = [];

            tempProducts.push(productsCopy[i]);

            groups.push({
              category: productsCopy[i].productTags.nodes[0].name,
              products: tempProducts,
              displayOrder:
                productsCopy[i].productTags.nodes[0].tagCategoryImages
                  .displayOrder,
            });

            console.log(
              "Group added - " + productsCopy[i].productTags.nodes[0].name
            );

            console.log(
              "Product added to group - " +
                productsCopy[i].productTags.nodes[0].name +
                " - " +
                productsCopy[i].name
            );
          }
        }
      } else {
      }
    }

    console.log(groups);

    return groups;
  };

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

  const [checkout] = useMutation(NEWORDER, {
    client: graphqlClient,
    onCompleted({ checkout }) {
      console.log("Order Received (", checkout, ")");

      setOrderComplete(true);

      // setOrderComplete();
    },
    onError(error) {
      console.error(error);
    },
  });

  async function handleSubmit(event, basket) {
    event.preventDefault();

    let lineItems = [];

    console.log(basket);

    for (let i = 0; i < basket.length; i++) {
      lineItems.push({
        productId: basket[i].product.databaseId,
        quantity: basket[i].quantity,
      });
    }

    console.log(lineItems);

    try {
      //   const source = await handleStripe();

      await checkout({
        variables: {
          input: {
            paymentMethod: "bacs",
            lineItems: lineItems,
            customerId: parseInt(employerUser),

            // metaData: [
            //   {
            //     key: `_stripe_source_id`,
            //     value: source.id,
            //   },
            // ],
          },
        },
      });
    } catch (error) {
      console.error("hi", error);
    }
  }

  const orderMore = (e, index) => {
    let item =
      subscriptions.data?.subscription.subscription.lineItems.nodes[index]
        .product.node;

    console.log(item);

    let basketTemp = [];

    basketTemp.push({ product: item, quantity: orderMoreQty });

    handleSubmit(e, basketTemp);
  };

  return (
    <div className="h-full">
      {orderComplete ? (
        <OrderComplete backToHome={backToHome} />
      ) : (
        <div className="bg-erniecream flex flex-col h-full gap-4 pb-6">
          <div
            className="px-6 py-4    bg-erniemint w-full h-[70px] flex flex-row items-center justify-between"
            onClick={backAction}
          >
            <div className="h-6 w-6 relative">
              <Image src="/left-arrow.svg" fill={true} className="h-6"></Image>
            </div>
            <p className="uppercase font-circe font-[900] text-center text-3xl line-[36px] mt-2 text-erniegreen">
              Quick Order
            </p>
          </div>
          <div className="flex flex-col gap-0 px-4">
            <div className="flex flex-col gap-2 mt-2 mb-4 bg-erniegreen p-4">
              <p className="font-circe text-3xl text-erniecream font-[900] uppercase mt-2">
                Your Subscription
              </p>
              <img src="/divider_cream.png" className="h-1.5 w-full mt-2"></img>
              <div className="flex flex-col gap-4 mt-2">
                {subscriptions.data?.subscription.subscription.lineItems.nodes.map(
                  (item, index) => (
                    <div className="flex flex-col gap-2" key={index}>
                      <div className="flex flex-row gap-4 w-full items-center">
                        <img
                          src={item.product.node.featuredImage.node.sourceUrl}
                          className="w-24 aspect-square object-contain"
                        ></img>
                        <div className="flex flex-col flex-shrink min-w-[calc(100%-112px)] ">
                          <p className="font-circe text-erniecream uppercase text-lg truncate font-[900] w-full">
                            {item.product.node.name}
                          </p>
                          <p
                            className={`font-circular text-erniecream font-[400] text-sm mb-4 line-clamp-3 h-[4em]`}
                          >
                            {item.product.node.description}
                          </p>
                          <div className="flex flex-row gap-2">
                            <p
                              className={`font-circe text-erniecream uppercase text-xl font-[900]`}
                            >
                              QTY:
                            </p>

                            <div className={`flex flex-row gap-2`}>
                              <div className="flex flex-row gap-2 flex-grow items-center justify-end">
                                <p className="text-erniecream inline font-circe uppercase font-[900] text-xl ">
                                  {item.quantity}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row gap-4">
                        <div className="flex flex-row">
                          <div
                            className="bg-erniegold flex flex-col justify-center items-center px-2 py-1 max-w-[24px] min-w-[24px] "
                            onClick={() => {
                              decQty();
                            }}
                          >
                            <img
                              src="/remove-green.svg"
                              className="w-6 h-6"
                            ></img>
                          </div>
                          <div className="bg-erniegold p-4 flex flex-col justify-center items-center w-16">
                            <p className="font-circe font-[900] uppercase text-erniegreen text-xl">
                              {orderMoreQty}
                            </p>
                          </div>
                          <div
                            className="bg-erniegold flex flex-col justify-center items-center px-2 py-1 max-w-[24px] min-w-[24px]"
                            onClick={() => {
                              incQty();
                            }}
                          >
                            <img src="/add-green.svg" className="w-6 h-6"></img>
                          </div>
                        </div>
                        <div
                          className="p-4 bg-erniegold flex-grow"
                          onClick={(e) => {
                            orderMore(e, index);
                          }}
                        >
                          <p className="font-circe font-[900] uppercase text-center text-xl text-erniegreen">
                            Order More
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
          {basket.length >= 1 && (
            <div className="border-2 border-erniegreen p-4 mx-4">
              <p className="uppercase font-circe font-[900] text-center text-2xl line-[36px] mt-2 text-erniegreen">
                Basket
              </p>
              <img src="/divider.png" className="h-1.5 w-full mt-2 mb-4"></img>
              <div className="flex flex-col gap-2">
                {basket.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-row gap-2 justify-between"
                  >
                    <p className="font-circe text-erniegreen font-[900] uppercase text-xl">
                      {item.product.name}
                    </p>
                    <p className="font-circe text-erniegreen font-[900] uppercase text-xl">
                      {"Qty: " + item.quantity}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div>
            {getGroupedProducts().map((group, index) => (
              <div
                className={`flex flex-col gap-0 px-4 pb-2 pt-4 w-full`}
                style={{ order: group.displayOrder }}
                key={index}
              >
                <p className="font-circe text-3xl text-erniegreen font-[900] uppercase mt-2">
                  {group.category}
                </p>
                <img
                  src="/divider.png"
                  className="h-1.5 w-full mt-2 mb-2"
                ></img>
                <div
                  className={`grid gap-4 w-full mt-4`}
                  style={{
                    gridTemplateRows:
                      "repeat(" + group.products.length + ", minmax(0, 1fr))",
                  }}
                >
                  {console.log(group)}
                  {group.products.map((product, productIndex) => (
                    <div
                      key={productIndex}
                      className="flex flex-row gap-4 w-full items-center bg-erniedarkcrea"
                    >
                      <img
                        src={product.image.sourceUrl}
                        className="w-24 aspect-square object-contain"
                      ></img>
                      <div className="flex flex-col flex-shrink min-w-[calc(100%-112px)] h-full">
                        <p className="font-circe text-erniegreen uppercase text-lg truncate font-[900] w-full">
                          {product.name}
                        </p>
                        <p
                          className={`font-circular text-erniegreen font-[400] text-sm mb-4 line-clamp-3 h-[4em] ${
                            product.description ? "block" : "hidden"
                          }`}
                        >
                          {product.description}
                        </p>
                        <div className="flex flex-row justify-between">
                          <p
                            className={`font-circe text-erniegreen uppercase text-3xl font-[900] ${
                              product.description ? "mt-0" : "mt-2"
                            }`}
                          >
                            {product.price}
                          </p>

                          <div className="flex flex-row">
                            <div className="flex flex-row gap-2 flex-grow items-center justify-end">
                              <div
                                className="flex flex-col justify-center items-center bg-erniegreen px-2 py-1 max-w-[24px] min-w-[24px]"
                                onClick={(e) => {
                                  newDecQty(product);
                                }}
                              >
                                <img
                                  src="/remove.svg"
                                  className="w-4 h-4"
                                ></img>
                              </div>
                              <p className="text-erniegreen inline font-circe uppercase font-[900] text-xl ">
                                {getQty(product)}
                              </p>
                              <div
                                className="flex flex-col justify-center items-center bg-erniegreen px-2 py-1 max-w-[24px] min-w-[24px]"
                                onClick={(e) => {
                                  newIncQty(product);
                                }}
                              >
                                <img src="/add.svg" className="w-4 h-4"></img>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div
            className="bg-erniegreen p-4 mx-4"
            onClick={(e) => {
              handleSubmit(e, basket);
            }}
          >
            <p className="font-circe font-[900] text-erniecream uppercase text-xl text-center">
              Order
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
