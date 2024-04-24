import Image from "next/image";
import { useState } from "react";

export const ManagePlan = ({
  backAction,
  products,
  subscriptions,
  updatePlan,
}) => {
  const [currentSubscription, setCurrentSubscription] = useState(
    subscriptions.data?.subscription.subscription
  );

  console.log(subscriptions.data?.subscription.subscription);

  const [subscriptionChanges, setSubscriptionChanges] = useState([]);

  const getFormattedDate = (date) => {
    let dateParts = date?.split("-");

    return date ? dateParts[2] + "/" + dateParts[1] + "/" + dateParts[0] : "//";
  };

  const [orderProducts, setOrderProducts] = useState([...products]);

  const highlightLineItems = () => {
    let highlightList = [];

    console.log(currentSubscription);

    for (let i = 0; i < orderProducts.length; i++) {
      for (let j = 0; j < currentSubscription.lineItems.nodes.length; j++) {
        if (
          orderProducts[i].name ==
          currentSubscription.lineItems.nodes[j].product.node.name
        ) {
          highlightList.push({
            highlighted: true,
            quantity: currentSubscription.lineItems.nodes[j].quantity,
            product: orderProducts[i],
          });

          continue;
        } else {
          highlightList.push({
            highlighted: false,
            quantity: 0,
            product: orderProducts[i],
          });

          continue;
        }
      }
    }

    return highlightList;
  };

  const getGroupedProducts = () => {
    let groups = [];

    let productsCopy = [...highlightLineItems()];

    for (let i = 0; i < productsCopy.length; i++) {
      if (productsCopy[i].product.__typename != "SubscriptionProduct") {
        let groupFound = false;

        if (
          productsCopy[i].product.productTags?.nodes[0].name !=
            "coffee machine" &&
          productsCopy[i].product.productTags?.nodes[0].name !=
            "cups/bottles" &&
          productsCopy[i].product.productTags?.nodes[0].name != "old-products"
        ) {
          if (groups.length != 0) {
            for (let j = 0; j < groups.length; j++) {
              if (
                groups[j].category ==
                productsCopy[i].product.productTags?.nodes[0].name
              ) {
                groups[j].products.push({
                  highlighted: productsCopy[i].highlighted,
                  quantity: productsCopy[i].quantity,
                  product: productsCopy[i].product,
                });

                if (productsCopy[i].highlighted) {
                  groups[j].highlighted = true;
                }

                groupFound = true;

                continue;
              }
            }

            if (!groupFound) {
              let tempProducts = [];

              tempProducts.push({
                highlighted: productsCopy[i].highlighted,
                quantity: productsCopy[i].quantity,
                product: productsCopy[i].product,
              });

              let highlighted = productsCopy[i].highlighted;

              groups.push({
                category: productsCopy[i].product.productTags.nodes[0].name,
                products: tempProducts,
                highlighted: highlighted,
                displayOrder:
                  productsCopy[i].product.productTags.nodes[0].tagCategoryImages
                    .displayOrder,
              });

              groupFound = true;

              continue;
            }
          } else {
            console.log("No groups exist");

            let tempProducts = [];

            let highlighted = productsCopy[i].highlighted;

            tempProducts.push({
              highlighted: productsCopy[i].highlighted,
              quantity: productsCopy[i].quantity,
              product: productsCopy[i].product,
            });

            groups.push({
              category: productsCopy[i].product.productTags.nodes[0].name,
              products: tempProducts,
              highlighted: highlighted,
              displayOrder:
                productsCopy[i].product.productTags.nodes[0].tagCategoryImages
                  .displayOrder,
            });
          }
        }
      } else {
      }
    }

    return groups;
  };

  const [showingHiddenProducts, setShowingHiddenProducts] = useState(false);

  const [productsContext, setProductsContext] = useState(getGroupedProducts());

  const [difference, setDifference] = useState([]);

  const incQuantity = (item, group) => {
    console.log(item, group);

    console.log(productsContext);
    console.log(currentSubscription);

    let contextCopy = [...productsContext];

    contextCopy[group].products[item].quantity++;

    let foundProduct = false;

    let currentSubscriptionCopy = JSON.parse(
      JSON.stringify(currentSubscription)
    );

    for (let i = 0; i < currentSubscriptionCopy.lineItems.nodes.length; i++) {
      if (
        currentSubscriptionCopy.lineItems.nodes[i].product.node.name ==
        contextCopy[group].products[item].product.name
      ) {
        currentSubscriptionCopy.lineItems.nodes[i].quantity++;
        foundProduct = true;
      }
    }

    if (!foundProduct) {
      currentSubscriptionCopy.lineItems.nodes.push({
        __typename: "LineItem",
        quantity: 1,
        product: { node: contextCopy[group].products[item].product },
      });
    }

    console.log(currentSubscriptionCopy);

    contextCopy[group].highlighted = true;
    contextCopy[group].products[item].highlighted = true;

    console.log(contextCopy[group].products[item]);

    setProductsContext(contextCopy);

    let differenceCopy = [...difference];

    let productFound = false;

    for (let i = 0; i < currentSubscriptionCopy.lineItems.nodes.length; i++) {
      productFound = false;

      for (let j = 0; j < currentSubscription.lineItems.nodes.length; j++) {
        console.log(
          currentSubscriptionCopy.lineItems.nodes[i].product.node.name,
          currentSubscription.lineItems.nodes[j].product.node.name
        );
        if (
          currentSubscriptionCopy.lineItems.nodes[i].product.node.name ==
          currentSubscription.lineItems.nodes[j].product.node.name
        ) {
          console.log("Match");

          console.log(
            currentSubscriptionCopy.lineItems.nodes[i].quantity,
            currentSubscription.lineItems.nodes[j].quantity
          );
          productFound = true;
          if (
            currentSubscriptionCopy.lineItems.nodes[i].quantity !=
            currentSubscription.lineItems.nodes[j].quantity
          ) {
            console.log(
              currentSubscriptionCopy.lineItems.nodes[i].quantity,
              currentSubscription.lineItems.nodes[j].quantity
            );

            let itemFound = false;

            for (let l = 0; l < differenceCopy.length; l++) {
              if (
                differenceCopy[l].product.node.name ==
                currentSubscriptionCopy.lineItems.nodes[i].product.node.name
              ) {
                differenceCopy[l].quantity++;
                itemFound = true;
                continue;
              }
            }

            if (!itemFound) {
              differenceCopy.push(currentSubscriptionCopy.lineItems.nodes[i]);
            }
            continue;
          }
        } else {
        }
      }

      if (!productFound) {
        console.log("New Product Detected");
        differenceCopy.push(currentSubscriptionCopy.lineItems.nodes[i]);
      }
    }

    setDifference(differenceCopy);

    setSubscriptionChanges(differenceCopy);

    setCurrentSubscription(currentSubscriptionCopy);

    console.log(differenceCopy);
  };

  const decQuantity = (item, group) => {
    console.log(item, group);

    console.log(productsContext);

    let contextCopy = [...productsContext];

    if (contextCopy[group].products[item].quantity > 0) {
      contextCopy[group].products[item].quantity--;
    }

    if (contextCopy[group].products[item].quantity == 0) {
      contextCopy[group].highlighted = false;
      contextCopy[group].products[item].highlighted = false;
    }

    let foundProduct = false;

    let currentSubscriptionCopy = JSON.parse(
      JSON.stringify(currentSubscription)
    );

    for (let i = 0; i < currentSubscriptionCopy.lineItems.nodes.length; i++) {
      if (
        currentSubscriptionCopy.lineItems.nodes[i].product.node.name ==
        contextCopy[group].products[item].product.name
      ) {
        console.log("Found product");
        if (currentSubscriptionCopy.lineItems.nodes[i].quantity > 1) {
          currentSubscriptionCopy.lineItems.nodes[i].quantity--;
        } else {
          currentSubscriptionCopy.lineItems.nodes.splice(i, 1);
        }
        foundProduct = true;
      }
    }

    let differenceCopy = [...difference];

    console.log(differenceCopy);

    for (let i = 0; i < differenceCopy.length; i++) {
      console.log(
        differenceCopy[i].product.node.name,
        contextCopy[group].products[item].product.name
      );
      if (
        differenceCopy[i].product.node.name ==
        contextCopy[group].products[item].product.name
      ) {
        console.log("Match");
        if (differenceCopy[i].quantity > 1) {
          differenceCopy[i].quantity--;
        } else {
          differenceCopy.splice(i, 1);
        }
      }
    }

    console.log(contextCopy[group].products[item]);

    console.log(currentSubscriptionCopy);

    setProductsContext(contextCopy);

    setDifference(differenceCopy);

    setSubscriptionChanges(differenceCopy);

    setCurrentSubscription(currentSubscriptionCopy);

    console.log(differenceCopy);
  };

  const runOrderUpdate = () => {
    updatePlan(currentSubscription.lineItems.nodes);
  };

  return (
    <div className="bg-erniecream flex flex-col h-full gap-4 pb-6">
      <div
        className="px-6 py-4    bg-erniemint w-full h-[70px] flex flex-row items-center justify-between"
        onClick={backAction}
      >
        <div className="h-6 w-6 relative">
          <Image src="/left-arrow.svg" fill={true} className="h-6"></Image>
        </div>
        <p className="uppercase font-circe font-[900] text-center text-3xl line-[36px] mt-2 text-erniegreen">
          Manage Plan
        </p>
      </div>
      <div className="flex flex-col gap-0 px-4">
        <div className="grid grid-cols-2 mt-2">
          <div className="flex flex-col gap-2">
            <p className="font-circular text-erniegreen font-[500]">
              Frequency
            </p>
            <p className="font-circe text-erniegreen font-[900] text-3xl uppercase">
              {currentSubscription.billingPeriod == "week"
                ? "Weekly"
                : currentSubscription.billingPeriod == "month"
                ? "Monthly"
                : currentSubscription.billingPeriod == ""
                ? "One-Off"
                : "Loading"}
            </p>
            {console.log(currentSubscription)}
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-circular text-erniegreen font-[500]">
              Next Delivery
            </p>
            <p className="font-circe text-erniegreen font-[900] text-3xl">
              {currentSubscription
                ? getFormattedDate(
                    currentSubscription.nextPaymentDate.split(" ")[0]
                  )
                : ""}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4 mt-4 mb-4">
          <img src="/divider.png" className="h-1.5 w-full mt-2"></img>
          <p className="font-circe text-3xl text-erniegreen font-[900] uppercase mt-2">
            Your Plan
          </p>
        </div>
        {productsContext.map((group, index) => (
          <div key={index}>
            {group.highlighted ? (
              <div
                className={`flex flex-col gap-0 px-4 pb-2 pt-4 w-full bg-erniedarkcream`}
                style={{ order: group.displayOrder }}
              >
                <p className="font-circe text-3xl text-erniegreen font-[900] uppercase mt-2">
                  {group.category}
                </p>
                <img
                  src="/divider.png"
                  className="h-1.5 w-full mt-2 mb-2"
                ></img>
                <div
                  className={`flex flex-col w-full mt-4 mb-2`}
                  style={{
                    gridTemplateRows:
                      "repeat(" + group.products.length + ", minmax(0, 1fr))",
                    gap: "10px",
                  }}
                >
                  {group.products.map((product, productIndex) => (
                    <div key={productIndex}>
                      {product.highlighted ? (
                        <div className="flex flex-row gap-4 w-full items-center bg-erniedarkcrea">
                          <img
                            src={product.product.image.sourceUrl}
                            className="w-24 aspect-square object-contain"
                          ></img>
                          <div className="flex flex-col flex-shrink min-w-[calc(100%-112px)] ">
                            <p className="font-circe text-erniegreen uppercase text-lg truncate font-[900] w-full">
                              {product.product.name}
                            </p>
                            <p
                              className={`font-circular text-erniegreen font-[400] text-sm mb-4 line-clamp-3 h-[4em] ${
                                product.product.description ? "block" : "hidden"
                              }`}
                            >
                              {product.product.description}
                            </p>
                            <div className="flex flex-row justify-between">
                              <p
                                className={`font-circe text-erniegreen uppercase text-3xl font-[900] ${
                                  product.product.description ? "mt-0" : "mt-2"
                                }`}
                              >
                                {product.product.price}
                              </p>

                              <div
                                className={`flex flex-row ${
                                  !showingHiddenProducts && "hidden"
                                }`}
                              >
                                <div className="flex flex-row gap-2 flex-grow items-center justify-end">
                                  <div
                                    className="flex flex-col justify-center items-center bg-erniegreen px-2 py-1 max-w-[24px] min-w-[24px]"
                                    onClick={(e) => {
                                      decQuantity(productIndex, index);
                                    }}
                                  >
                                    <img
                                      src="/remove.svg"
                                      className="w-4 h-4"
                                    ></img>
                                  </div>
                                  <p className="text-erniegreen inline font-circe uppercase font-[900] text-xl ">
                                    {product.quantity}
                                  </p>
                                  <div
                                    className="flex flex-col justify-center items-center bg-erniegreen px-2 py-1 max-w-[24px] min-w-[24px]"
                                    onClick={(e) => {
                                      incQuantity(productIndex, index);
                                    }}
                                  >
                                    <img
                                      src="/add.svg"
                                      className="w-4 h-4"
                                    ></img>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          {showingHiddenProducts && (
                            <div className="flex flex-row gap-4 w-full items-center bg-erniedarkcrea">
                              <img
                                src={product.product.image.sourceUrl}
                                className="w-24 aspect-square object-contain"
                              ></img>
                              <div className="flex flex-col flex-shrink min-w-[calc(100%-112px)] ">
                                <p className="font-circe text-erniegreen uppercase text-lg truncate font-[900] w-full">
                                  {product.product.name}
                                </p>
                                <p
                                  className={`font-circular text-erniegreen font-[400] text-sm mb-4 line-clamp-3 h-[4em] ${
                                    product.product.description
                                      ? "block"
                                      : "hidden"
                                  }`}
                                >
                                  {product.product.description}
                                </p>
                                <div className="flex flex-row justify-between">
                                  <p
                                    className={`font-circe text-erniegreen uppercase text-3xl font-[900] ${
                                      product.product.description
                                        ? "mt-0"
                                        : "mt-2"
                                    }`}
                                  >
                                    {product.product.price}
                                  </p>

                                  <div className="flex flex-row">
                                    <div className="flex flex-row gap-2 flex-grow items-center justify-end">
                                      <div
                                        className="flex flex-col justify-center items-center bg-erniegreen px-2 py-1 max-w-[24px] min-w-[24px]"
                                        onClick={(e) => {
                                          decQuantity(productIndex, index);
                                        }}
                                      >
                                        <img
                                          src="/remove.svg"
                                          className="w-4 h-4"
                                        ></img>
                                      </div>
                                      <p className="text-erniegreen inline font-circe uppercase font-[900] text-xl ">
                                        {product.quantity}
                                      </p>
                                      <div
                                        className="flex flex-col justify-center items-center bg-erniegreen px-2 py-1 max-w-[24px] min-w-[24px]"
                                        onClick={(e) => {
                                          incQuantity(productIndex, index);
                                        }}
                                      >
                                        <img
                                          src="/add.svg"
                                          className="w-4 h-4"
                                        ></img>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                {showingHiddenProducts ? (
                  <div
                    className={`flex flex-col gap-0 px-4 pb-2 pt-4 w-full bg-erniedarkcream`}
                    style={{ order: group.displayOrder }}
                  >
                    <p className="font-circe text-3xl text-erniegreen font-[900] uppercase mt-2">
                      {group.category}
                    </p>
                    <img
                      src="/divider.png"
                      className="h-1.5 w-full mt-2 mb-2"
                    ></img>
                    <div
                      className={`grid w-full mt-4 mb-2`}
                      style={{
                        gridTemplateRows:
                          "repeat(" +
                          group.products.length +
                          ", minmax(0, 1fr))",
                        gap: "10px",
                      }}
                    >
                      {group.products.map((product, productIndex) => (
                        <div key={productIndex}>
                          <div className="flex flex-row gap-4 w-full items-center bg-erniedarkcrea">
                            <img
                              src={product.product.image.sourceUrl}
                              className="w-24 aspect-square object-contain"
                            ></img>
                            <div className="flex flex-col flex-shrink min-w-[calc(100%-112px)] ">
                              <p className="font-circe text-erniegreen uppercase text-lg truncate font-[900] w-full">
                                {product.product.name}
                              </p>
                              <p
                                className={`font-circular text-erniegreen font-[400] text-sm mb-4 line-clamp-3 h-[4em] ${
                                  product.product.description
                                    ? "block"
                                    : "hidden"
                                }`}
                              >
                                {product.product.description}
                              </p>
                              <div className="flex flex-row justify-between">
                                <p
                                  className={`font-circe text-erniegreen uppercase text-3xl font-[900] ${
                                    product.product.description
                                      ? "mt-0"
                                      : "mt-2"
                                  }`}
                                >
                                  {product.product.price}
                                </p>

                                <div className="flex flex-row">
                                  <div className="flex flex-row gap-2 flex-grow items-center justify-end">
                                    <div
                                      className="flex flex-col justify-center items-center bg-erniegreen px-2 py-1 max-w-[24px] min-w-[24px]"
                                      onClick={(e) => {
                                        decQuantity(productIndex, index);
                                      }}
                                    >
                                      <img
                                        src="/remove.svg"
                                        className="w-4 h-4"
                                      ></img>
                                    </div>
                                    <p className="text-erniegreen inline font-circe uppercase font-[900] text-xl ">
                                      {product.quantity}
                                    </p>
                                    <div
                                      className="flex flex-col justify-center items-center bg-erniegreen px-2 py-1 max-w-[24px] min-w-[24px]"
                                      onClick={(e) => {
                                        incQuantity(productIndex, index);
                                      }}
                                    >
                                      <img
                                        src="/add.svg"
                                        className="w-4 h-4"
                                      ></img>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
            )}
          </div>
        ))}
        <div
          className="bg-erniegreen p-4 mt-4"
          onClick={() => {
            if (showingHiddenProducts) {
              runOrderUpdate();
            }
            setShowingHiddenProducts(!showingHiddenProducts);
          }}
        >
          <p className="font-circe text-erniecream uppercase font-[900] text-xl text-center">
            {showingHiddenProducts ? "Save" : "Edit"} Items
          </p>
        </div>
      </div>
    </div>
  );
};
