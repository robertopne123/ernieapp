import Image from "next/image";
import ProductLists from "./productPages/productslist";
import { useEffect, useState, useContext } from "react";
import Alert from "./alert";
import Checkout from "./shopPages/checkout";
import { ApolloProvider, gql } from "@apollo/client";
import { useMutation } from "@apollo/client";
import graphqlClient from "../apollo-client";
import CartContext from "./context/cart-context";
import Preview from "./productPages/preview";
import { BrandInfo } from "./productPages/brandInfo";
import { Purchasing } from "./productPages/purchasing";

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
  addToSubBasket,
  addToOneOffBasket,
  subBasket,
  oneOffBasket,
  purchaseType,
  purchasing,
  managingSubscription,
  setPurchaseType,
  setPurchasing,
  newPurchase,
  setNewPurchase,
  subscriptions,
  setTab,
  productsContext,
  setProductsContext,
  addingToSBasket,
  addingToOBasket,
  setAddingToSBasket,
  setAddingToOBasket,
  cfh,
}) {
  // function filteredCategories() {
  //   let filtered = [];

  //   console.log(productCategories);

  //   let productTags = [...productCategories];

  //   let filteredTags = [];

  //   for (let i = 0; i < productTags.length; i++) {
  //     if (productTags[i].tagOrder.tagOrder != null) {
  //       filteredTags.push(productTags[i]);
  //     }
  //   }

  //   console.log(filteredTags);

  //   const tags = products.reduce((acc, product) => {
  //     const tagName = product.productTags?.nodes[0].name;
  //     if (tagName) {
  //       if (!acc[tagName]) {
  //         acc[tagName] = [];
  //       }
  //       acc[tagName].push(product);
  //     }
  //     return acc;
  //   }, {});

  //   console.log(tags);
  //   console.log(products);

  //   for (const [key, value] of Object.entries(tags)) {
  //     for (let j = 0; j < tags[key].length; j++) {
  //       for (let k = 0; k < products.length; k++) {
  //         if (tags[key][j].databaseId == products[k].databaseId) {
  //           let temp = { arrIndex: k, product: products[k] };

  //           tags[key][j] = temp;
  //         }
  //       }
  //     }
  //   }

  //   console.log(tags);

  //   let tagsWithBrands = [];

  //   for (const [key, value] of Object.entries(tags)) {
  //     tagsWithBrands.push({
  //       category: key,
  //       brands: value.reduce((acc, product) => {
  //         const brandName = product.product.brands?.nodes[0]?.name;
  //         if (brandName) {
  //           if (!acc[brandName]) {
  //             acc[brandName] = [];
  //           }
  //           acc[brandName].push(product);
  //         }
  //         return acc;
  //       }, {}),
  //     });
  //   }

  //   for (let i = 0; i < tagsWithBrands.length; i++) {
  //     for (let j = 0; j < filteredTags.length; j++) {
  //       if (tagsWithBrands[i].category == filteredTags[j].name) {
  //         tagsWithBrands[i].order = filteredTags[j].tagOrder;
  //       }
  //     }

  //     console.log(tagsWithBrands[i].brands);

  //     let brandObjects = [];

  //     for (const [key, value] of Object.entries(tagsWithBrands[i].brands)) {
  //       tagsWithBrands[i].brands[key] = {};
  //       tagsWithBrands[i].brands[key].name = key;
  //       tagsWithBrands[i].brands[key].products = value;
  //       tagsWithBrands[i].brands[key].description =
  //         tagsWithBrands[i].brands[
  //           key
  //         ].products[0].product.brands?.nodes[0]?.description;
  //       tagsWithBrands[i].brands[key].image =
  //         tagsWithBrands[i].brands[
  //           key
  //         ].products[0].product.brands?.nodes[0]?.brandingImage.image?.sourceUrl;
  //       tagsWithBrands[i].brands[key].order =
  //         tagsWithBrands[i].brands[
  //           key
  //         ].products[0].product.brands?.nodes[0]?.brandOrder?.brandOrder;
  //       brandObjects.push(tagsWithBrands[i].brands[key]);
  //     }

  //     tagsWithBrands[i].brands = brandObjects;

  //     console.log(tagsWithBrands);
  //   }

  //   for (let i = 0; i < tagsWithBrands.length; i++) {
  //     if (tagsWithBrands[i].order != null) {
  //       filtered.push(tagsWithBrands[i]);
  //     }
  //   }

  //   console.log(filtered);

  //   filtered.sort(function (a, b) {
  //     return a.order.tagOrder - b.order.tagOrder;
  //   });

  //   return filtered;
  // }

  console.log(products);

  function filteredCategories() {
    let filtered = [];

    console.log(productCategories);

    let productTags = [...productCategories];

    let filteredTags = [];

    for (let i = 0; i < productTags.length; i++) {
      if (productTags[i].tagOrder.tagOrder != null) {
        filteredTags.push(productTags[i]);
      }
    }

    console.log(products);

    const tags = products.reduce((acc, product) => {
      // Apply the forHome check only if cfh is true
      if (cfh) {
        if (product?.productDisplayStyle?.forHome) {
          const tagName = product.productTags?.nodes[0].name;
          if (tagName) {
            if (!acc[tagName]) {
              acc[tagName] = [];
            }
            acc[tagName].push(product);
          }
        }
        return acc;
      } else {
        const tagName = product.productTags?.nodes[0].name;
        if (tagName) {
          if (!acc[tagName]) {
            acc[tagName] = [];
          }
          acc[tagName].push(product);
        }
        return acc;
      }
    }, {});

    console.log(tags);
    console.log(products);

    for (const [key, value] of Object.entries(tags)) {
      for (let j = 0; j < tags[key].length; j++) {
        for (let k = 0; k < products.length; k++) {
          if (tags[key][j].databaseId == products[k].databaseId) {
            let temp = { arrIndex: k, product: products[k] };

            tags[key][j] = temp;
          }
        }
      }
    }

    console.log(tags);

    let tagsWithBrands = [];

    for (const [key, value] of Object.entries(tags)) {
      tagsWithBrands.push({
        category: key,
        brands: value.reduce((acc, product) => {
          console.log(value);
          const brandName = product.product.brands?.nodes[0]?.name;
          if (brandName) {
            if (!acc[brandName]) {
              acc[brandName] = [];
            }
            acc[brandName].push(product);
          }
          return acc;
        }, {}),
      });
    }

    console.log(tagsWithBrands);

    for (let i = 0; i < tagsWithBrands.length; i++) {
      for (let j = 0; j < filteredTags.length; j++) {
        if (tagsWithBrands[i].category == filteredTags[j].name) {
          tagsWithBrands[i].order = filteredTags[j].tagOrder;
        }
      }

      console.log(tagsWithBrands[i].brands);

      let brandObjects = [];

      for (const [key, value] of Object.entries(tagsWithBrands[i].brands)) {
        tagsWithBrands[i].brands[key] = {};
        tagsWithBrands[i].brands[key].name = key;
        tagsWithBrands[i].brands[key].products = value;
        tagsWithBrands[i].brands[key].description =
          tagsWithBrands[i].brands[
            key
          ].products[0].product.brands?.nodes[0]?.description;
        tagsWithBrands[i].brands[key].image =
          tagsWithBrands[i].brands[
            key
          ].products[0].product.brands?.nodes[0]?.brandingImage.image?.sourceUrl;
        tagsWithBrands[i].brands[key].order =
          tagsWithBrands[i].brands[
            key
          ].products[0].product.brands?.nodes[0]?.brandOrder?.brandOrder;
        brandObjects.push(tagsWithBrands[i].brands[key]);
      }

      tagsWithBrands[i].brands = brandObjects;

      console.log(tagsWithBrands);
    }

    for (let i = 0; i < tagsWithBrands.length; i++) {
      if (tagsWithBrands[i].order != null) {
        filtered.push(tagsWithBrands[i]);
      }
    }

    console.log(filtered);

    filtered.sort(function (a, b) {
      return a.order.tagOrder - b.order.tagOrder;
    });

    return filtered;
  }

  const [productFilter, setProductFilter] = useState(-1);

  const [basketShowing, setBasketShowing] = useState(false);

  const back = () => setPreviewing(false);

  const checkoutBack = () => setShowingCheckout(false);

  const setProductsContextFromProducts = (products) => {
    setProductsContext(products);
  };

  const showAlertFromProductPage = (message, type) => {
    showAlert(message, type);
  };

  const setAlertActionFromProductPage = (action) => {
    setAlertAction(action);
  };

  const setBasketFromProductPage = (item) => {
    setBasket(item);
  };

  const setAddingToSBasketFromProductPage = (val) => {
    setAddingToSBasket(val);
  };

  const setAddingToOBasketFromProductPage = (val) => {
    setAddingToOBasket(val);
  };

  // console.log(subsidy);

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
      // console.log(data);
      addToCart(data?.cart);
    },
  });

  const addToBasketFromProductPage = (item, category) => {
    // console.log(category);

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
    // console.log(basket);
  }, [basket]);

  const [basketCount, setBasketCount] = useState(0);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const increaseQty = (index) => {
    let newBasket = basket;

    let basketObj = newBasket[index];

    basketObj.qty = basketObj.qty + 1;

    newBasket.splice(index, 1, basketObj);

    // console.log(newBasket);

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

    // console.log(category);

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

    // console.log(newBasket);

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
    // console.log(basket);
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
          productsCopy[i].productTags?.nodes[0].name != "old-products" &&
          productsCopy[i].productTags?.nodes[0].name != "Donation"
        ) {
          if (groups.length != 0) {
            for (let j = 0; j < groups.length; j++) {
              if (
                groups[j].category == productsCopy[i].productTags?.nodes[0].name //Category match
              ) {
                // console.log(productsCopy[i].brands?.nodes[0].name);
                // console.log(productsCopy[i]);
                // console.log(i);
                // console.log(groups[j]);
                // console.log(groups[j].brands);
                let brandFound = false;

                for (let k = 0; k < groups[j].brands?.length; k++) {
                  if (
                    groups[j].brands?.[k].name ==
                    productsCopy[i].brands?.nodes[0].name
                  ) {
                    // console.log(productsCopy[i].productTags?.nodes[0].name);

                    groups[j].brands?.[k].products.push(productsCopy[i]);
                    brandFound = true;

                    groupFound = true;
                  }

                  continue;
                }

                if (!brandFound) {
                  let products = [];

                  // console.log(productsCopy[i]);

                  products.push(productsCopy[i]);

                  groups[j].brands?.push({
                    name: productsCopy[i].brands.nodes[0]?.name,
                    description: productsCopy[i].brands.nodes[0]?.description,
                    image:
                      productsCopy[i].brands.nodes[0].brandingImage.image
                        ?.sourceUrl,
                    products: products,
                  });
                  groupFound = true;

                  continue;
                }
              }
            }

            if (!groupFound) {
              let tempProducts = [];

              tempProducts.push(productsCopy[i]);

              let tempBrands = [];

              tempBrands.push({
                name: productsCopy[i].brands.nodes[0]?.name,
                description: productsCopy[i].brands.nodes[0]?.description,
                image:
                  productsCopy[i].brands.nodes[0]?.brandingImage?.image
                    ?.sourceUrl,
                products: tempProducts,
              });

              groups.push({
                category: productsCopy[i].productTags.nodes[0].name,
                brands: tempBrands,
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

            let tempBrands = [];

            tempBrands.push({
              name: productsCopy[i].brands.nodes[0]?.name,
              description: productsCopy[i].brands.nodes[0]?.description,
              image:
                productsCopy[i].brands.nodes[0]?.brandingImage.image?.sourceUrl,
              products: tempProducts,
            });

            // console.log(tempProducts);

            groups.push({
              category: productsCopy[i].productTags.nodes[0].name,
              brands: tempBrands,
              displayOrder:
                productsCopy[i].productTags.nodes[0].tagCategoryImages
                  .displayOrder,
            });
          }
        }
      } else {
      }
    }

    let sortedGroups = getSortedProducts(groups);

    // console.log(sortedGroups);

    return sortedGroups;
  };

  const [selectedTab, setSelectedTab] = useState(0);

  const [previewing, setPreviewing] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(0);

  const [selectedBrand, setSelectedBrands] = useState(0);

  const [showingInfo, setShowingInfo] = useState(false);

  const setTabFromProducts = (tab) => {
    setTab(tab);
  };

  const [infoName, setInfoName] = useState("");
  const [infoDesc, setInfoDesc] = useState("");
  const [infoImage, setInfoImage] = useState("");

  const close = () => {
    setShowingInfo(false);
  };

  const getSortedProducts = (arr) => {
    return arr.sort(function (a, b) {
      return a.displayOrder - b.displayOrder;
    });
  };

  const addToSubBasketFromProducts = (item) => {
    addToSubBasket(item);
  };

  const addToOneOffBasketFromProducts = (item) => {
    addToOneOffBasket(item);
  };

  const setPType = (val) => {
    setPurchaseType(val);
  };

  const setP = (val) => {
    setPurchasing(val);
  };

  const setNewP = (val) => {
    setNewPurchase(val);
  };

  const getCheapestVariant = (variants) => {
    let lowestPrice = 0.0;
    let lowestPriceLoc = 0;

    for (let i = 0; i < variants?.length; i++) {
      let price = parseFloat(variants[i]?.price.replace("£", ""));

      console.log(price);

      if (lowestPrice == 0.0) {
        lowestPrice = price;
        lowestPriceLoc = i;
      } else {
        if (lowestPrice > price) {
          lowestPrice = price;
          lowestPriceLoc = i;
        }
      }
    }

    return variants[lowestPriceLoc]?.price;
  };

  return (
    <ApolloProvider client={graphqlClient}>
      <div className="h-full lg:w-[calc(100vw-112px)] relative flex flex-col bg-erniedarkcream pt-8 lg:pt-10 pb-8 lg:pb-10 overflow-auto">
        {showingInfo && (
          <BrandInfo
            close={close}
            name={infoName}
            description={infoDesc}
            image={infoImage}
          />
        )}
        {purchasing && !newPurchase && (
          <Purchasing
            close={close}
            purchaseType={purchaseType}
            setPurchaseType={setPType}
            setPurchasing={setP}
            setNewPurchase={setNewP}
            cfh={cfh}
          />
        )}
        <div className="flex lg:hidden">
          {previewing ? (
            <Preview
              product={products[selectedProduct]}
              backAction={back}
              role={1}
              addToBasket={addToBasket}
              category={getGroupedProducts()[selectedTab].category}
              addToSubBasket={addToSubBasketFromProducts}
              addToOneOffBasket={addToOneOffBasketFromProducts}
              subBasket={subBasket}
              oneOffBasket={oneOffBasket}
              pType={purchaseType}
              subscriptions={subscriptions}
              managingSubscription={managingSubscription}
              setTab={setTabFromProducts}
              productsContext={productsContext}
              setProductsContext={setProductsContextFromProducts}
              addingToSBasket={addingToSBasket}
              addingToOBasket={addingToOBasket}
              setAddingToSBasket={setAddingToSBasketFromProductPage}
              setAddingToOBasket={setAddingToOBasketFromProductPage}
            />
          ) : (
            <div className="flex flex-col gap-0 h-auto pb-0 w-full">
              {purchaseType == 0 && (
                <div className="flex flex-col gap-0 mx-6 lg:mx-10 mb-4">
                  <div className="flex flex-row justify-between">
                    <p className="font-circe text-2xl text-erniegreen font-[900] uppercase mt-2">
                      One-off Purchase
                    </p>
                  </div>
                  <img
                    src="/divider.png"
                    className="h-1.5 w-full mt-2 mb-2"
                  ></img>
                </div>
              )}

              {console.log(managingSubscription)}
              {purchaseType == 1 &&
                (managingSubscription ? (
                  <div className="flex flex-col gap-0 mx-6 lg:mx-10 mb-4">
                    <div className="flex flex-row justify-between">
                      <p className="font-circe text-2xl text-erniegreen font-[900] uppercase mt-2">
                        Managing Subscription
                      </p>
                    </div>
                    <img
                      src="/divider.png"
                      className="h-1.5 w-full mt-2 mb-2"
                    ></img>
                  </div>
                ) : (
                  <div className="flex flex-col gap-0 mx-6 mb-4">
                    <div className="flex flex-row justify-between">
                      <p className="font-circe text-2xl text-erniegreen font-[900] uppercase mt-2">
                        Add To Subscription
                      </p>
                    </div>
                    <img
                      src="/divider.png"
                      className="h-1.5 w-full mt-2 mb-2"
                    ></img>
                  </div>
                ))}

              <div className="flex flex-row overflow-auto flex-nowrap px-6 lg:px-10 gap-2 cursor-pointer">
                {filteredCategories()
                  .sort(function (a, b) {
                    return a.order - b.order;
                  })
                  .map((tab, index) => (
                    <div
                      className={`py-2 px-3 rounded-lg text-nowrap w-auto lg:w-auto ${
                        selectedTab == index ? "bg-ernieteal" : "bg-erniecream"
                      }`}
                      key={index}
                      onClick={() => {
                        setSelectedTab(index);
                      }}
                    >
                      <p
                        className={`font-circular font-[500] text-sm capitalize tab text-nowrap lg:text-base ${
                          selectedTab == index
                            ? "text-erniecream"
                            : "text-erniegreen"
                        }`}
                      >
                        {tab.category}
                      </p>
                    </div>
                  ))}
              </div>
              <div className="flex flex-col-reverse">
                {console.log(filteredCategories()[selectedTab])}

                {filteredCategories()
                  [selectedTab].brands.sort(function (a, b) {
                    return b.order - a.order;
                  })
                  .map((brand, index) => (
                    <div
                      className={`flex flex-col gap-0 pb-4 px-6 lg:px-10 pb-2 pt-4 lg:pt-6 w-full`}
                      key={index}
                    >
                      <div className="flex flex-row justify-between">
                        <p className="font-circe text-2xl text-erniegreen font-[900] uppercase mt-2">
                          {brand.name}
                        </p>
                        <img
                          src="/info.svg"
                          className="w-8 mt-1"
                          onClick={() => {
                            setShowingInfo(true);
                            setInfoName(brand.name);
                            setInfoDesc(brand.description);
                            setInfoImage(brand.image);
                          }}
                        />
                      </div>
                      <img
                        src="/divider.png"
                        className="h-1.5 w-full mt-2 mb-2"
                      ></img>
                      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 mt-4">
                        {console.log(brand.products)}
                        {brand.products
                          .sort(function (a, b) {
                            return (
                              a.product.productOrdering?.productOrder -
                              b.product.productOrdering?.productOrder
                            );
                          })
                          .map((product, productIndex) => (
                            <div
                              key={productIndex}
                              className="flex flex-row gap-4 w-full items-center bg-erniecream rounded-xl p-6"
                            >
                              <div className="flex relative aspect-[3/4] h-[100px]">
                                <img
                                  src={product.product.image.sourceUrl}
                                  className={`h-[100px] w-auto aspect-[3/4] ${
                                    selectedTab == 1
                                      ? "object-contain"
                                      : "object-cover"
                                  }`}
                                ></img>
                                {product.product.productDisplayStyle.badgeImage
                                  ?.sourceUrl && (
                                  <img
                                    src={
                                      product.product.productDisplayStyle
                                        .badgeImage.sourceUrl
                                    }
                                    className="absolute w-10 -bottom-4 -right-4 rounded-full"
                                  ></img>
                                )}
                              </div>
                              <div className="flex flex-col flex-shrink max-w-[calc(100vw-75px-48px-48px)] h-full pl-4">
                                <p className="font-circe text-erniegreen uppercase text-lg font-[900] w-full leading-[20px]">
                                  {product.product.name}
                                </p>
                                <div className="line-clamp-3">
                                  <p
                                    className={`font-circular text-erniegreen font-[400] text-xs mt-2 ${
                                      product.product.description
                                        ? "block"
                                        : "hidden"
                                    } ${
                                      product?.product?.productDisplayStyle
                                        ?.allowOrdering
                                        ? "mb-2"
                                        : "mb-4"
                                    }`}
                                  >
                                    {product.product.description}
                                  </p>
                                </div>
                                {product?.product.productDisplayStyle
                                  ?.allowOrdering && (
                                  <div className="flex flex-row gap-1 items-end mt-2">
                                    <p className="font-circular text-erniegreen text-sm font-[500] leading-[28px]">
                                      from
                                    </p>
                                    <p
                                      className={`font-circe text-erniegreen uppercase text-lg font-[900] ${
                                        product.product.description
                                          ? "mt-0"
                                          : "mt-2"
                                      }`}
                                    >
                                      {console.log(product.product.type)}
                                      {product.product.type == "SIMPLE"
                                        ? product.product.price
                                        : getCheapestVariant(
                                            product.product.variations?.nodes
                                          )}
                                    </p>
                                  </div>
                                )}
                                <div
                                  className={`bg-erniegold py-2 px-4 rounded-xl inline self-start mt-2 cursor-pointer  ${
                                    product.product?.productDisplayStyle
                                      .allowOrdering
                                      ? "mt-2"
                                      : "mt-4"
                                  }`}
                                  onClick={() => {
                                    setSelectedBrands(index);
                                    setSelectedProduct(product.arrIndex);

                                    setPreviewing(true);
                                  }}
                                >
                                  <p className="font-circe font-[900] text-sm">
                                    Choose Options
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        <div className="hidden lg:flex">
          {previewing && (
            <Preview
              product={products[selectedProduct]}
              backAction={back}
              role={1}
              addToBasket={addToBasket}
              category={getGroupedProducts()[selectedTab].category}
              addToSubBasket={addToSubBasketFromProducts}
              addToOneOffBasket={addToOneOffBasketFromProducts}
              subBasket={subBasket}
              oneOffBasket={oneOffBasket}
              pType={purchaseType}
              subscriptions={subscriptions}
              managingSubscription={managingSubscription}
              setTab={setTabFromProducts}
              productsContext={productsContext}
              setProductsContext={setProductsContextFromProducts}
              addingToSBasket={addingToSBasket}
              addingToOBasket={addingToOBasket}
              setAddingToSBasket={setAddingToSBasketFromProductPage}
              setAddingToOBasket={setAddingToOBasketFromProductPage}
            />
          )}
          <div className="flex flex-col gap-0 h-auto">
            {purchaseType == 0 && (
              <div className="flex flex-col gap-0 mx-6 lg:mx-10 mb-4">
                <div className="flex flex-row justify-between">
                  <p className="font-circe text-2xl text-erniegreen font-[900] uppercase mt-2">
                    One-off Purchase
                  </p>
                </div>
                <img
                  src="/divider.png"
                  className="h-1.5 w-full mt-2 mb-2"
                ></img>
              </div>
            )}

            {console.log(managingSubscription)}
            {purchaseType == 1 &&
              (managingSubscription ? (
                <div className="flex flex-col gap-0 mx-6 lg:mx-10 mb-4">
                  <div className="flex flex-row justify-between">
                    <p className="font-circe text-2xl text-erniegreen font-[900] uppercase mt-2">
                      Managing Subscription
                    </p>
                  </div>
                  <img
                    src="/divider.png"
                    className="h-1.5 w-full mt-2 mb-2"
                  ></img>
                </div>
              ) : (
                <div className="flex flex-col gap-0 mx-6 mb-4">
                  <div className="flex flex-row justify-between">
                    <p className="font-circe text-2xl text-erniegreen font-[900] uppercase mt-2">
                      Add To Subscription
                    </p>
                  </div>
                  <img
                    src="/divider.png"
                    className="h-1.5 w-full mt-2 mb-2"
                  ></img>
                </div>
              ))}

            <div className="flex flex-row overflow-auto flex-nowrap px-6 lg:px-10 gap-2 cursor-pointer">
              {filteredCategories()
                .sort(function (a, b) {
                  return a.order - b.order;
                })
                .map((tab, index) => (
                  <div
                    className={`py-2 px-3 rounded-lg text-nowrap w-full lg:w-auto ${
                      selectedTab == index ? "bg-ernieteal" : "bg-erniecream"
                    }`}
                    key={index}
                    onClick={() => {
                      setSelectedTab(index);
                    }}
                  >
                    <p
                      className={`font-circular font-[500] text-sm capitalize tab text-nowrap lg:text-base ${
                        selectedTab == index
                          ? "text-erniecream"
                          : "text-erniegreen"
                      }`}
                    >
                      {tab.category}
                    </p>
                  </div>
                ))}
            </div>
            <div className="flex flex-col-reverse">
              {console.log(filteredCategories()[selectedTab])}

              {filteredCategories()
                [selectedTab].brands.sort(function (a, b) {
                  return b.order - a.order;
                })
                .map((brand, index) => (
                  <div
                    className={`flex flex-col gap-0 pb-4 px-6 lg:px-10 pb-2 pt-4 lg:pt-6 w-full`}
                    key={index}
                  >
                    <div className="flex flex-row justify-between">
                      <p className="font-circe text-2xl text-erniegreen font-[900] uppercase mt-2">
                        {brand.name}
                      </p>
                      <img
                        src="/info.svg"
                        className="w-8 mt-1"
                        onClick={() => {
                          setShowingInfo(true);
                          setInfoName(brand.name);
                          setInfoDesc(brand.description);
                          setInfoImage(brand.image);
                        }}
                      />
                    </div>
                    <img
                      src="/divider.png"
                      className="h-1.5 w-full mt-2 mb-2"
                    ></img>
                    <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 mt-4">
                      {console.log(brand.products)}
                      {brand.products
                        .sort(function (a, b) {
                          return (
                            a.product.productOrdering?.productOrder -
                            b.product.productOrdering?.productOrder
                          );
                        })
                        .map((product, productIndex) => (
                          <div
                            key={productIndex}
                            className="flex flex-row gap-4 w-full items-center bg-erniecream rounded-xl p-6"
                          >
                            <div className="flex relative aspect-[3/4] h-[100px]">
                              <img
                                src={product.product.image.sourceUrl}
                                className={`h-[100px] w-auto aspect-[3/4] ${
                                  selectedTab == 1
                                    ? "object-contain"
                                    : "object-cover"
                                }`}
                              ></img>
                              {product.product.productDisplayStyle.badgeImage
                                ?.sourceUrl && (
                                <img
                                  src={
                                    product.product.productDisplayStyle
                                      .badgeImage.sourceUrl
                                  }
                                  className="absolute w-10 -bottom-4 -right-4 rounded-full"
                                ></img>
                              )}
                            </div>
                            <div className="flex flex-col flex-shrink max-w-[calc(100vw-75px-48px-48px)] h-full pl-4">
                              <p className="font-circe text-erniegreen uppercase text-lg font-[900] w-full leading-[20px]">
                                {product.product.name}
                              </p>
                              <div className="line-clamp-3">
                                <p
                                  className={`font-circular text-erniegreen font-[400] text-xs mt-2 ${
                                    product.product.description
                                      ? "block"
                                      : "hidden"
                                  } ${
                                    product?.product?.productDisplayStyle
                                      ?.allowOrdering
                                      ? "mb-2"
                                      : "mb-4"
                                  }`}
                                >
                                  {product.product.description}
                                </p>
                              </div>
                              {console.log(product)}
                              {product?.product.productDisplayStyle
                                ?.allowOrdering && (
                                <div className="flex flex-row gap-1 items-end mt-2">
                                  <p className="font-circular text-erniegreen text-sm font-[500] leading-[28px]">
                                    from
                                  </p>

                                  <p
                                    className={`font-circe text-erniegreen uppercase text-lg font-[900] ${
                                      product.product.description
                                        ? "mt-0"
                                        : "mt-2"
                                    }`}
                                  >
                                    {product.product.type == "SIMPLE"
                                      ? product.product.price
                                      : getCheapestVariant(
                                          product.product.variations?.nodes
                                        )}
                                  </p>
                                </div>
                              )}
                              <div
                                className={`bg-erniegold py-2 px-4 rounded-xl inline self-start ${
                                  product.product?.productDisplayStyle
                                    .allowOrdering
                                    ? "mt-2"
                                    : "mt-4"
                                } cursor-pointer`}
                                onClick={() => {
                                  setSelectedBrands(index);
                                  setSelectedProduct(product.arrIndex);

                                  setPreviewing(true);
                                }}
                              >
                                <p className="font-circe font-[900] text-sm">
                                  Choose Options
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
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
            category={"healthy snacks"}
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
        {/* {console.log("CART")}
        {console.log(cart?.data?.cart)} */}
        {/* <div className="relative h-[7%]">
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
                                  {basketItem.category == "healthy snacks"
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
                                  {basketItem.category == "healthy snacks"
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
        </div> */}
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
