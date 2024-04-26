import Image from "next/image";
import ProductLists from "./productPages/productslist";
import { useEffect, useState, useContext } from "react";
import Alert from "./alert";
import Checkout from "./shopPages/checkout";
import { ApolloProvider, gql } from "@apollo/client";
import { useMutation } from "@apollo/client";
import graphqlClient from "@/apollo-client";
import CartContext from "./context/cart-context";

export default function Products({
  productCategories,
  products,
  subsidy,
  customer,
  role,
  addToBasket,
  setBasket,
  basket,
  sessionToken,
  cart,
  employerUser,
}) {
  function filteredCategories() {
    let filtered = [];

    console.log(productCategories);

    for (let i = 0; i < productCategories.length; i++) {
      if (
        productCategories[i].tagCategoryImages.displayOrder != null &&
        productCategories[i].tagCategoryImages.displayOrder != -1
      ) {
        filtered.push(productCategories[i]);
      }
    }

    console.log(filtered);

    filtered.sort(function (a, b) {
      return (
        a.tagCategoryImages.displayOrder - b.tagCategoryImages.displayOrder
      );
    });

    return filtered;
  }

  const [productFilter, setProductFilter] = useState(-1);

  const [basketShowing, setBasketShowing] = useState(false);

  const back = () => setProductFilter(-1);

  const checkoutBack = () => setShowingCheckout(false);

  const showAlertFromProductPage = (message, type) => {
    showAlert(message, type);
  };

  const setAlertActionFromProductPage = (action) => {
    setAlertAction(action);
  };

  const setBasketFromProductPage = (item) => {
    setBasket(item);
  };

  console.log(subsidy);

  const ADD_TO_CART = gql`
    mutation addtocart(
      $productId: Int!
      $quantity: Int!
      $clientMutationId: String!
    ) {
      addToCart(
        input: {
          productId: $productId
          quantity: $quantity
          clientMutationId: $clientMutationId
        }
      ) {
        cart {
          subtotal
          total
          shippingTotal
          contents {
            itemCount
            nodes {
              quantity
              product {
                node {
                  name
                  sku
                  databaseId
                  ... on SimpleProduct {
                    price
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const { items, addToCart, removeFromCart } = useContext(CartContext);

  const [addToCartMutation] = useMutation(ADD_TO_CART, {
    client: graphqlClient,
    onCompleted: (data) => {
      console.log(data);
      addToCart(data?.cart);
    },
  });

  const addToBasketFromProductPage = (item, category) => {
    console.log(category);

    let basketObj = {
      id: item.id,
      databaseId: item.databaseId,
      name: item.name,
      qty: 1,
      category: category,
      price: item.price == null ? "£0.00" : item.price,
    };

    let itemExists = false;

    let newBasket = basket;

    for (let i = 0; i < basket.length; i++) {
      if (basket[i].id == item.id) {
        basketObj.qty = basket[i].qty + 1;

        newBasket.splice(i, 1);

        newBasket.push(basketObj);

        itemExists = true;
      }
    }

    if (!itemExists) {
      newBasket.push(basketObj);
    }

    setBasket(newBasket);

    let count = 0;

    for (let i = 0; i < basket.length; i++) {
      count = count + basket[i].qty;
    }

    setBasketCount(count);
  };

  useEffect(() => {
    console.log(basket);
  }, [basket]);

  const [basketCount, setBasketCount] = useState(0);

  const [selectedIndex, setSelectedIndex] = useState(0);

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
      showAlertFromProductPage(
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

  const hideBasket = () => {
    setBasketShowing(false);
  };

  useEffect(() => {
    console.log(basket);
  }, [basket]);

  const [showingAlert, setShowingAlert] = useState(false);

  const [alertMessage, setAlertMessage] = useState("");

  const [alertAction, setAlertAction] = useState("");

  const [basketEdit, setBasketEditing] = useState(-1);

  const [showingCheckout, setShowingCheckout] = useState(false);

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
    setBasketCount(0);
    setBasketShowing(false);
  };

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

  const setShowingCheckoutFromProductPage = () => {
    setShowingCheckout(false);
  };

  const setShowingBasketFromProductPage = () => {
    setBasketShowing(false);
    setBasketCount(0);
    setBasket([]);
  };

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
          if (groups.length != 0) {
            for (let j = 0; j < groups.length; j++) {
              if (
                groups[j].category == productsCopy[i].productTags?.nodes[0].name
              ) {
                groups[j].products.push(productsCopy[i]);
                groupFound = true;

                continue;
              }
            }

            if (!groupFound) {
              let tempProducts = [];

              tempProducts.push(productsCopy[i]);

              groups.push({
                category: productsCopy[i].productTags.nodes[0].name,
                products: tempProducts,
                displayOrder:
                  productsCopy[i].productTags.nodes[0].tagCategoryImages
                    .displayOrder,
              });

              groupFound = true;

              continue;
            }
          } else {
            let tempProducts = [];

            tempProducts.push(productsCopy[i]);

            groups.push({
              category: productsCopy[i].productTags.nodes[0].name,
              products: tempProducts,
              displayOrder:
                productsCopy[i].productTags.nodes[0].tagCategoryImages
                  .displayOrder,
            });
          }
        }
      } else {
      }
    }

    console.log(groups);

    return groups;
  };

  return (
    <ApolloProvider client={graphqlClient}>
      <div className="h-full w-full relative flex flex-col bg-erniecream pt-8 pb-8 overflow-auto">
        <div className="flex flex-col gap-8">
          {/* {console.log(getGroupedProducts())} */}
          {getGroupedProducts().map((group, index) => (
            <div
              className={`flex flex-col gap-0 px-4 pb-2 pt-4 w-full`}
              style={{ order: group.displayOrder }}
              key={index}
            >
              <p className="font-circe text-3xl text-erniegreen font-[900] uppercase mt-2">
                {group.category}
              </p>
              <img src="/divider.png" className="h-1.5 w-full mt-2 mb-2"></img>
              <div
                className={`grid gap-4 w-full mt-4`}
                style={{
                  gridTemplateRows:
                    "repeat(" + group.products.length + ", minmax(0, 1fr))",
                }}
              >
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

                        {/* <div className="flex flex-row">
                          <div className="flex flex-row gap-2 flex-grow items-center justify-end">
                            <div
                              className="flex flex-col justify-center items-center bg-erniegreen px-2 py-1 max-w-[24px] min-w-[24px]"
                              onClick={(e) => {}}
                            >
                              <img src="/remove.svg" className="w-4 h-4"></img>
                            </div>
                            <p className="text-erniegreen inline font-circe uppercase font-[900] text-xl ">
                              0
                            </p>
                            <div
                              className="flex flex-col justify-center items-center bg-erniegreen px-2 py-1 max-w-[24px] min-w-[24px]"
                              onClick={(e) => {}}
                            >
                              <img src="/add.svg" className="w-4 h-4"></img>
                            </div>
                          </div>
                        </div> */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {/* {productFilter == -1 && (
          <div
            className={`w-full flex bg-erniecream flex-col flex-grow overflow-auto`}
          >
            {filteredCategories()?.map((category, index) => (
              <div
                key={index}
                className={`flex flex-col justify-center bg-cover gap-6 relative min-h-[200px] ${
                  category.name == "cups/bottles" ? "order-3" : ""
                }`}
                onClick={(e) => {
                  setProductFilter(index);
                }}
              >
                <div className="h-full w-full absolute">
                  <Image
                    src={category.tagCategoryImages?.tagImage?.sourceUrl}
                    fill={true}
                    className="w-full h-full object-cover"
                    priority
                  ></Image>
                </div>
                <div className="w-full h-full z-10 flex flex-col justify-center gap-6">
                  <p className="text-center font-circe uppercase text-4xl font-[900] text-erniecream">
                    {category.name}
                  </p>
                  <div className="bg-erniegold py-2 px-4 w-auto mx-auto text-center font-circe uppercase font-[900] text-lg">
                    <p className="">Explore The Range</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )} */}
        {productFilter == 0 && (
          <ProductLists
            products={products}
            category={"cups/bottles"}
            backAction={back}
            role={role}
            addToBasket={addToBasketFromProductPage}
            hideBasket={hideBasket}
          ></ProductLists>
        )}
        {productFilter == 1 && (
          <ProductLists
            products={products}
            category={"coffee"}
            backAction={back}
            role={role}
            addToBasket={addToBasketFromProductPage}
            hideBasket={hideBasket}
          ></ProductLists>
        )}
        {productFilter == 2 && (
          <ProductLists
            products={products}
            category={"hot chocolate"}
            backAction={back}
            role={role}
            addToBasket={addToBasketFromProductPage}
            hideBasket={hideBasket}
          ></ProductLists>
        )}
        {productFilter == 3 && (
          <ProductLists
            products={products}
            category={"squirrel sisters"}
            backAction={back}
            role={role}
            addToBasket={addToBasketFromProductPage}
            hideBasket={hideBasket}
          ></ProductLists>
        )}
        {showingCheckout && (
          <Checkout
            backAction={checkoutBack}
            basket={basket}
            subsidy={subsidy}
            customer={customer}
            setBasket={setBasketFromProductPage}
            setBasketCount={setBasketCount}
            setSelectedIndex={setSelectedIndex}
            setAlert={showAlertFromProductPage}
            setShowingAlert={setShowingAlert}
            setShowingCheckout={setShowingCheckoutFromProductPage}
            setShowingBasket={setShowingBasketFromProductPage}
            employerUser={employerUser}
          />
        )}
        {console.log("CART")}
        {console.log(cart?.data?.cart)}
        {role == 1 && (
          <div className="relative h-[7%]">
            {basketShowing && (
              <div className="absolute w-full h-[55vh] bg-erniegreen bottom-full z-10 px-4 py-6">
                {basket?.length == 0 ? (
                  <div className="w-full h-full flex flex-col justify-center items-center">
                    <p className="font-circe text-erniecream uppercase font-[900] text-xl">
                      Your Basket Is Empty
                    </p>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col gap-2">
                    <div className="flex flex-row justify-end gap-2">
                      <p className="font-circe text-erniecream uppercase font-[900]">
                        {basketEdit != 0 ? "Edit" : "Editing"}
                      </p>
                      <img
                        src="/edit.svg"
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
                    <img
                      src="/divider_cream.png"
                      className="w-full h-2 mb-2"
                    ></img>
                    <div className="w-full h-full flex flex-col gap-4">
                      {basket?.map((basketItem, index) => (
                        <div className="flex flex-col gap-4" key={index}>
                          <div className="flex flex-row gap-4 justify-between">
                            <p className="text-erniecream inline font-circe uppercase font-[900] text-lg flex-shrink max-w-[50%] text-ellipsis text-nowrap whitespace-nowrap overflow-hidden">
                              {basketItem.name}
                            </p>
                            <div className="flex flex-row gap-4 justify-end">
                              <p className="text-erniecream inline font-circe uppercase font-[900] text-xl">
                                {basketItem.price}
                              </p>
                              {basketEdit == -1 && (
                                <p className="text-erniecream inline font-circe uppercase font-[900] text-xl ">
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
                            </div>
                            {basketEdit != -1 && (
                              <div className="flex flex-row gap-2 flex-grow items-center justify-end">
                                <div
                                  className="flex flex-col justify-center items-center bg-erniecream px-2 py-1 max-w-[24px] min-w-[24px]"
                                  onClick={(e) => {
                                    reduceQty(index);
                                  }}
                                >
                                  <img
                                    src="/remove.svg"
                                    className="w-4 h-4 invert"
                                  ></img>
                                </div>
                                <p className="text-erniecream inline font-circe uppercase font-[900] text-xl ">
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
                                  className="flex flex-col justify-center items-center bg-erniecream px-2 py-1 max-w-[24px] min-w-[24px]"
                                  onClick={(e) => {
                                    increaseQty(index);
                                  }}
                                >
                                  <img
                                    src="/add.svg"
                                    className="w-4 h-4 invert"
                                  ></img>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <img
                      src="/divider_cream.png"
                      className="w-full h-2 mb-2"
                    ></img>
                    <div className="flex flex-row justify-end gap-2">
                      <p className="font-circe text-erniecream font-[900] uppercase mt-1.5">
                        TOTAL
                      </p>
                      <p className="font-circe text-erniecream font-[900] uppercase text-2xl">
                        £{getBasketTotal()}
                      </p>
                    </div>
                    <div className="flex flex-row justify-end gap-2">
                      <p className="font-circe text-erniecream font-[900] uppercase mt-1.5">
                        SUBSIDY ({subsidy?.amount ? subsidy.amount : subsidy}%)
                      </p>
                      <p className="font-circe text-erniecream font-[900] uppercase text-2xl">
                        £
                        {(
                          (getBasketTotal()
                            ? getBasketTotal().replace("£", "")
                            : 0) *
                          ((subsidy?.amount ? subsidy.amount : subsidy) * 0.01)
                        ).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex flex-row justify-end gap-2 pb-2">
                      <p className="font-circe text-erniecream font-[900] uppercase mt-1.5">
                        SUBTOTAL
                      </p>
                      <p className="font-circe text-erniecream font-[900] uppercase text-2xl">
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
                    <div className="flex flex-row justify-end gap-4">
                      <div
                        className={`bg-erniecream px-4 py-2 justify-center items-center ${
                          basket?.length == 0 ? "opacity-50" : ""
                        }`}
                        onClick={(e) => {
                          if (basket?.length != 0) {
                            clearBasket();
                          }
                        }}
                      >
                        <p className="font-circe text-erniegreen font-[900] uppercase">
                          Clear
                        </p>
                      </div>
                      <div
                        className="bg-erniecream px-4 py-2 justify-center items-center"
                        onClick={(e) => {
                          if (basket?.length != 0) {
                            setShowingCheckout(true);
                          }
                        }}
                      >
                        <p className="font-circe text-erniegreen font-[900] uppercase">
                          Checkout
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div
              className="bg-erniegreen h-full w-full flex-grow py-2 px-3 flex flex-row items-center justify-between"
              onClick={(e) => {
                if (basketShowing) {
                  setBasketShowing(false);
                } else {
                  setBasketShowing(true);
                }
              }}
            >
              <div className="flex flex-row">
                <p className="font-circe text-erniecream uppercase text-xl inline mt-0.5">
                  Basket
                </p>
                <div className="flex flex-col aspect-square p-1 mt-0.5">
                  <div className="bg-erniecream rounded-full flex flex-col items-center justify-center aspect-square p-1">
                    <p className="font-circular text-erniegreen text-xs w-3 h-3 text-center line-[12px] -mt-1">
                      {basketCount}
                    </p>
                  </div>
                </div>
              </div>
              <img
                src="/left-arrow-cream.svg"
                className={`w-5 h-5 ${
                  basketShowing == true ? "rotate-90" : "-rotate-90"
                }`}
              />
            </div>
          </div>
        )}
        {showingAlert && (
          <Alert
            message={alertMessage}
            type={alertAction}
            close={closeAlert}
            action={removeItem}
          />
        )}
      </div>
    </ApolloProvider>
  );
}
