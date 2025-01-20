import Image from "next/image";
import { useEffect, useState } from "react";
import { ConfirmSubscription } from "./managePlanComponents/confirmSubscription";
import { ConfirmFrequency } from "./managePlanComponents/confirmFrequency";

export const ManagePlan = ({
  backAction,
  products,
  subscriptions,
  orders,
  updatePlan,
  updatePlanFrequency,
  updateSubError,
  setPurchaseType,
  setPurchasing,
  setNewPurchase,
  setManagingSubscription,
}) => {
  const [currentSubscription, setCurrentSubscription] = useState(
    subscriptions?.subscriptions
      ? subscriptions?.subscriptions.data?.subscription?.subscription
      : subscriptions?.data?.subscription?.subscription
  );

  const [existingSubscription, setExistingSubscription] = useState(
    subscriptions.data?.subscription?.subscription
  );

  console.log(subscriptions);

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
      for (let j = 0; j < currentSubscription?.lineItems.nodes.length; j++) {
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

            console.log(productsCopy[i].product);

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

  const [productsContext, setProductsContext] = useState(
    subscriptions.data.subscription.subscription.lineItems.nodes
  );

  const [difference, setDifference] = useState([]);

  const [subChanges, setSubChanges] = useState([]);

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
      if (!foundProduct) {
        if (
          currentSubscriptionCopy.lineItems.nodes[i].product.node.name ==
          contextCopy[group].products[item].product.name
        ) {
          console.log("Found product");

          currentSubscriptionCopy.lineItems.nodes[i].quantity++;
          foundProduct = true;
        }
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
                console.log(differenceCopy[l]);

                differenceCopy[l].quantity++;
                itemFound = true;
                continue;
              }
            }

            if (!itemFound) {
              differenceCopy.push(currentSubscriptionCopy.lineItems.nodes[i]);

              console.log(differenceCopy[0]);
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

    console.log(currentSubscriptionCopy);
  };

  const decQuantity = (item, group) => {
    console.log(item, group);

    console.log(productsContext);

    let contextCopy = [...productsContext];

    if (contextCopy[group].products[item].quantity > 0) {
      contextCopy[group].products[item].quantity--;
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
        if (currentSubscriptionCopy.lineItems.nodes[i].quantity >= 1) {
          currentSubscriptionCopy.lineItems.nodes[i].quantity--;
          console.log(currentSubscriptionCopy.lineItems.nodes[i].quantity);
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

  console.log(subscriptions);

  const changeFrequency = (frequency) => {
    let currentSubscriptionCopy = JSON.parse(
      JSON.stringify(currentSubscription)
    );

    switch (frequency) {
      case "weekly":
        currentSubscriptionCopy.billingPeriod = "week";
        currentSubscriptionCopy.billingInterval = "1";
        break;
      case "bi-weekly":
        currentSubscriptionCopy.billingPeriod = "week";
        currentSubscriptionCopy.billingInterval = "2";
        break;
      case "monthly":
        currentSubscriptionCopy.billingPeriod = "month";
        currentSubscriptionCopy.billingInterval = "1";
        break;
      case "bi-monthly":
        currentSubscriptionCopy.billingPeriod = "month";
        currentSubscriptionCopy.billingInterval = "2";
        break;
    }

    setCurrentSubscription(currentSubscriptionCopy);
  };

  const runOrderUpdate = () => {
    console.log(currentSubscription);

    updatePlan(currentSubscription.lineItems.nodes);
    setProcessingOrder(false);
  };

  const updateFrequencyPlan = () => {
    updatePlanFrequency(currentSubscription);
  };

  const getChangesItems = () => {
    let current = currentSubscription.lineItems.nodes;
    let existing = existingSubscription.lineItems.nodes;

    console.log(currentSubscription);

    console.log(current);
    console.log(existing);

    let changes = [];

    let order = 0;

    //Check old products are still there
    for (let i = 0; i < existing.length; i++) {
      if (existing[i].databaseId == current[i].databaseId) {
        // Line exists
        console.log("line exists");
        if (existing[i].quantity != current[i].quantity) {
          //Quantity isn't same
          console.log("Qty diff");
          changes.push({
            changeType: "qty_change",
            change: current[i].quantity - existing[i].quantity,
            lineItem: {
              databaseId: current[i].databaseId,
              product: {
                node: current[i].product.node,
              },
              quantity: current[i].quantity,
            },
          });
        }
      } else {
        console.log("product removed");
        changes.push({
          changeType: "item_remove",
          lineItem: {
            databaseId: current[i].databaseId,
            product: {
              node: current[i].product.node,
            },
            quantity: current[i].quantity,
          },
        });
      }
    }

    console.log(changes);
  };

  const [showSubConfirmation, setShowingSubConfirmation] = useState(false);
  const [showFreqConfirmation, setShowingFreqConfirmation] = useState(false);

  const [processingOrder, setProcessingOrder] = useState(false);

  const close = () => {
    setShowingSubConfirmation(false);
    setShowingFreqConfirmation(false);
  };

  console.log(productsContext);

  const getFilteredGroupProduct = (group) => {
    let products = [];

    for (let i = 0; i < group.products.length; i++) {
      if (group.products[i].highlighted) {
        products.push(group.products[i]);
      }
    }

    return products;
  };

  const getFilteredLoc = (group, index) => {
    let unfiltered = group.products;

    let filtered = getFilteredGroupProduct(group);

    let unfilteredProduct = group.products[index].product.name;

    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i].product.name == unfilteredProduct) {
        return i;
      }
    }
  };

  return (
    <>
      {console.log(currentSubscription)}
      {showSubConfirmation && (
        <ConfirmSubscription
          close={close}
          difference={currentSubscription.lineItems.nodes}
          update={runOrderUpdate}
          updateSubError={updateSubError}
        />
      )}
      {showFreqConfirmation && (
        <ConfirmFrequency
          close={close}
          onComplete={() => {
            close();
            backAction();
          }}
          difference={currentSubscription}
          update={updateFrequencyPlan}
          updateSubError={updateSubError}
        />
      )}

      <div className="bg-erniedarkcream h-full flex flex-col gap-6 pb-8 px-6 lg:p-10 overflow-y-scroll ">
        <div
          className="py-2 lg:pb-2 lg:pt-0 flex flex-row items-center gap-1 border-b-[1px] border-erniegreen cursor-pointer"
          onClick={backAction}
        >
          <div className="h-3 w-3 lg:w-4 lg:w-4 relative">
            <Image src="/left-arrow.svg" fill={true} className="h-6"></Image>
          </div>
          <p className="font-circular font-[500] text-center text-sm text-erniegreen lg:text-base">
            Back
          </p>
        </div>
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <div className="bg-erniecream p-6 rounded-lg flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <p className="font-circe font-[900] text-lg text-erniegreen uppercase lg:text-xl">
                  My Subscription
                </p>
                <img src="/divider.png" className="w-full"></img>
              </div>
              <div className="flex flex-col py-2 gap-2">
                {productsContext.map((product, productIndex) => (
                  <>
                    <div key={productIndex} className={`flex`}>
                      <div className="flex flex-row gap-4 w-full items-center bg-erniedarkcrea">
                        <div className="flex flex-row justify-between w-full">
                          {console.log(product)}
                          <p className="font-circular text-erniegreen font-[500] w-full text-sm">
                            {product.product.node.type == "SIMPLE"
                              ? product.product.node.name
                              : product.variation?.node.name}
                          </p>

                          <div className="flex flex-row justify-between">
                            <div className={`flex flex-row`}>
                              <div className="flex flex-row gap-2 flex-grow items-center justify-end">
                                <div
                                  className="flex flex-col justify-center items-center border-[1px] border-erniegreen rounded-full aspect-[1/1] p-1 min-w-[22px] max-h-[20px] cursor-pointer"
                                  onClick={(e) => {
                                    decQuantity(productIndex, index);
                                  }}
                                >
                                  <img
                                    src="/remove-green.svg"
                                    className="w-3 h-3"
                                  ></img>
                                </div>

                                {/* {product.quantity <
                                        existingSubscription?.lineItems.nodes[
                                          getFilteredLoc(group, productIndex) -
                                            1
                                        ]?.quantity && (
                                        <p
                                          className={`
                                          text-red-400 inline font-circular text-sm font-[500] w-3 text-center`}
                                        >
                                          {product.quantity}
                                        </p>
                                      )} */}
                                {/* {product.quantity ==
                                        existingSubscription?.lineItems.nodes[
                                          getFilteredLoc(group, productIndex) - 1
                                        ]?.quantity && ( */}
                                <p
                                  className={`
                                          
                                          text-erniegreen inline font-circular text-sm font-[500] w-3 text-center`}
                                >
                                  {product.quantity}
                                </p>
                                {/* {product.quantity >
                                        existingSubscription?.lineItems.nodes[
                                          getFilteredLoc(group, productIndex) - 1
                                        ]?.quantity && (
                                        <p
                                          className={`
                                          text-ernieteal inline font-circular text-sm font-[500] w-3 text-center`}
                                        >
                                          {product.quantity}
                                        </p>
                                      )} */}
                                <div
                                  className="flex flex-col justify-center items-center border-[1px] border-erniegreen rounded-full aspect-[1/1] p-1 min-w-[22px] max-h-[20px] cursor-pointer"
                                  onClick={(e) => {
                                    incQuantity(productIndex, index);
                                  }}
                                >
                                  <img
                                    src="/add-green.svg"
                                    className="w-3 h-3"
                                  ></img>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ))}
              </div>
              <div
                className="bg-erniegold px-4 py-2 rounded-lg cursor-pointer"
                onClick={() => {
                  setPurchaseType(1);
                  setPurchasing(true);
                  setNewPurchase(true);
                  setManagingSubscription(true);
                }}
              >
                <p className="font-circe text-erniegreen font-[900] text-xl text-center">
                  Add More Products
                </p>
              </div>
              <div
                className="bg-erniegold px-4 py-2 rounded-lg cursor-pointer flex flex-row justify-center items-center"
                onClick={() => {
                  getChangesItems();
                  setShowingSubConfirmation(true);
                  // runOrderUpdate();
                  setProcessingOrder(true);
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
                <p className="font-circe text-erniegreen font-[900] text-xl text-center">
                  Save Selection
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="bg-erniecream p-6 rounded-lg flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <p className="font-circe font-[900] text-lg text-erniegreen uppercase lg:text-xl">
                  Frequency
                </p>
                <img src="/divider.png" className="w-full"></img>
              </div>
              <div className="flex flex-col">
                <select
                  name="frequency"
                  onChange={(e) => {
                    changeFrequency(e.target.value);
                  }}
                  className="border-[1px] border-erniegreen bg-erniecream rounded-lg font-circular px-2 py-2 text-erniegreen text-sm font-[500]"
                >
                  <option
                    value="weekly"
                    selected={
                      currentSubscription?.billingPeriod == "week" &&
                      currentSubscription?.billingInterval == "1"
                    }
                  >
                    Weekly
                  </option>
                  <option
                    value="bi-weekly"
                    selected={
                      currentSubscription?.billingPeriod == "week" &&
                      currentSubscription?.billingInterval == "2"
                    }
                  >
                    {"Bi-weekly (once every two weeks)"}
                  </option>
                  <option
                    value="monthly"
                    selected={
                      currentSubscription?.billingPeriod == "month" &&
                      currentSubscription?.billingInterval == "1"
                    }
                  >
                    Monthly
                  </option>
                  <option
                    value="bi-monthly"
                    selected={
                      currentSubscription?.billingPeriod == "month" &&
                      currentSubscription?.billingInterval == "2"
                    }
                  >
                    {"Bi-monthly (once every two months)"}
                  </option>
                </select>
              </div>
              <div
                className="bg-erniegold px-4 py-2 rounded-lg cursor-pointer"
                onClick={() => {
                  setShowingFreqConfirmation(true);
                }}
              >
                <p className="font-circe text-erniegreen font-[900] text-xl text-center">
                  Save Selection
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* <div
          className="bg-erniegold px-4 py-2 rounded-lg cursor-pointer"
          onClick={() => {}}
        >
          <p className="font-circe text-erniegreen font-[900] text-xl text-center">
            Skip Next Subscription Delivery
          </p>
        </div> */}
      </div>
    </>
  );
};
