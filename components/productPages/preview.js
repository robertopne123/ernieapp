import { useMutation } from "@apollo/client";
import Image from "next/image";
import CartContext from "../context/cart-context";
import { useEffect, useState } from "react";
import { Info } from "../dashboardComponents/info";
import { Browser } from "@capacitor/browser";

export default function Preview({
  product,
  backAction,
  role,
  addToBasket,
  category,
  addToSubBasket,
  addToOneOffBasket,
  subBasket,
  oneOffBasket,
  pType,
  subscriptions,
  managingSubscription,
  setTab,
  productsContext,
  setProductsContext,
  addingToSBasket,
  addingToOBasket,
  setAddingToSBasket,
  setAddingToOBasket,
}) {
  const addToBasketFromPreviewPage = (item, category) => {
    addToBasket(item, category);
  };

  const [purchaseType, setPurchaseType] = useState(-1);

  const isInSubscription = () => {
    for (
      let i = 0;
      i < subscriptions.data.subscription.subscription.lineItems.nodes.length;
      i++
    ) {
      if (
        subscriptions.data.subscription.subscription.lineItems.nodes[i].product
          .node.name == product.name
      ) {
        return true;
      }
    }

    return false;
  };

  const whereInSubscription = () => {
    for (
      let i = 0;
      i < subscriptions.data.subscription.subscription.lineItems.nodes.length;
      i++
    ) {
      if (
        subscriptions.data.subscription.subscription.lineItems.nodes[i].product
          .node.name == product.name
      ) {
        return i;
      }
    }

    return -1;
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

    return lowestPriceLoc;
  };

  const getDefaultSelectedVariants = () => {
    for (let i = 0; i < product.variations.nodes?.length; i++) {
      console.log(product.variations.nodes[i]);

      let titleParts = product.variations.nodes[i].name.split(" - ");

      console.log(titleParts);

      if (titleParts.length == 2) {
        let variantParts = titleParts[1].split(", ");

        console.log(variantParts);

        if (variantParts.length == 1) {
          if (titleParts[1] == selectedType) {
            return i;
          }
        } else {
          if (
            variantParts[0] == selectedSize &&
            variantParts[1] == selectedType
          ) {
            return i;
          }
        }
      }
    }

    return null;
  };

  const [subQuantity, setSubQuantity] = useState(
    purchaseType == 1 && isInSubscription()
      ? subscriptions.data.subscription.subscription.lineItems.nodes[
          whereInSubscription()
        ].quantity
      : 1
  );

  const [oneOffQuantity, setOneOffQuantity] = useState(1);

  const isInOneOffBasket = () => {
    for (let i = 0; i < oneOffBasket.length; i++) {
      if (oneOffBasket[i].product.databaseId == product.databaseId) {
        return true;
      }
    }

    return false;
  };

  const setTabFromPreview = (tab) => {
    setTab(tab);
  };

  console.log(category);

  const [showFullDesc, setShowingFullDesc] = useState(false);

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const howToDrink = (data) => {
    return data.teaExtraInfo.howToDrink
      .replace("<p>", "")
      .replace("</p>", "")
      .split("<br />");
  };

  const [showingInfo, setShowingInfo] = useState(false);

  const openCapacitorSite = async (link) => {
    await Browser.open({ url: link });
  };

  const getDefaultVariants = () => {
    let temp = {};

    console.log(product.attributes?.nodes);
    console.log(
      product.variations?.nodes[getCheapestVariant(product.variations.nodes)]
    );

    for (let i = 0; i < product.attributes?.nodes?.length; i++) {
      let cheapestVariant =
        product.variations.nodes[getCheapestVariant(product.variations.nodes)];

      temp[product.attributes.nodes[i]?.name.toLowerCase()] =
        cheapestVariant.name
          .split("-")
          [cheapestVariant.name.split("-").length - 1].split(", ")
          [i].replace(" ", "");
    }

    console.log(temp);

    return temp;
  };

  const [selectedVariants, setSelectedVariants] = useState(
    getDefaultVariants()
  );

  useEffect(() => {
    console.log(selectedVariants);
  }, [selectedVariants]);

  const findVariant = (variants, sVariants) => {
    for (let i = 0; i < variants.length; i++) {
      let variantName = variants[i].name.split("-")[1].replace(" ", "");

      let sVariantsStr = "";

      for (let j = 0; j < sVariants.length; j++) {
        if (sVariantsStr != "") {
          sVariantsStr += ", ";
          sVariantsStr += sVariants[j];
        } else {
          sVariantsStr += sVariants[j];
        }
      }

      if (variantName == sVariantsStr) {
        return i;
      }
    }

    return -1;
  };

  console.log(getCheapestVariant(product.variations?.nodes));

  console.log(product);

  const [selectedSize, setSelectedSize] = useState("1kg Tub");
  const [selectedType, setSelectedType] = useState("Beans");

  const [selectedVariant, setSelectedVariant] = useState(
    product.variations?.nodes[getDefaultSelectedVariants()]
  );

  useEffect(() => {
    console.log(selectedSize);
  }, [selectedSize]);

  useEffect(() => {
    console.log(selectedType);
  }, [selectedType]);

  return (
    <div
      className={`absolute flex flex-col gap-6 h-full w-full overflow-auto bg-erniedarkcream pb-16 px-6 lg:px-10 z-10 lg:w-[70%] lg:h-[70%] lg:left-1/2 lg:top-1/2 lg:translate-x-[-50%] lg:translate-y-[-50%] lg:border-[1px] lg:border-erniegreen lg:rounded-xl lg:p-10 lg:shadow-xl`}
    >
      {console.log(selectedVariant)}
      {showingInfo && (
        <Info
          name={"Coffee That Connects: Bridging Communities with Groundswell "}
          description={
            "Ernie London is proud to partner with Groundswell, a charity creating healthier lives, stronger voices and better futures for anyone with experience of homelessness. We share the belief that everyone deserves to be seen, heard and supported. Our contribution will fuel Groundswell’s person-centered and participatory approach to tackling homelessness, where often the most powerful first step is connecting over a cup of coffee. Together, we’re turning every sip into a step towards solving homelessness, recognising that change often begins with a simple, human gesture. "
          }
          close={close}
          link={"https://groundswell.org.uk/"}
        />
      )}
      <div
        className="py-2 lg:pt-10 flex flex-row items-center gap-1 border-b-[1px] border-erniegreen cursor-pointer lg:hidden"
        onClick={backAction}
      >
        <div className="h-3 w-3 lg:h-4 lg:w-4 relative">
          <Image
            src="/left-arrow.svg"
            fill={true}
            className="h-6 lg:h-12"
          ></Image>
        </div>
        <p className="font-circular font-[500] text-center text-sm text-erniegreen lg:text-xl">
          Back
        </p>
      </div>
      <div
        className="absolute right-0 top-0 bg-ernieteal hover:bg-erniemint cursor-pointer p-4 rounded-bl-lg hidden lg:flex"
        onClick={backAction}
      >
        <img src="/cross_cream.svg" className="w-5 "></img>
      </div>
      <div
        className={`flex flex-col lg:flex-row gap-6 bg-erniecream rounded-xl p-6 lg:p-10 h-auto lg:gap-10 ${
          pType != 0 && pType != 1 ? "mb-0" : "mb-0"
        }`}
      >
        <div className="w-full lg:w-1/2 lg:min-w-[40%] bg-cover h-[300px] lg:h-[400px] relative">
          <div className="z-10 h-[300px] lg:h-[400px]">
            {product?.productTags.nodes[0].name != "healthy snacks" && (
              <div className="h-full mx-auto relative z-10">
                <Image
                  src={product.image.sourceUrl}
                  className="h-full mx-auto mr-0"
                  fill={true}
                  priority
                  style={{ objectFit: "contain" }}
                ></Image>

                <Image
                  src={product.productDisplayStyle.badgeImage.sourceUrl}
                  width={100}
                  height={100}
                  priority
                  className="w-28 lg:w-28 absolute bottom-0 right-0 lg:right-[-20px] rounded-full"
                />
              </div>
            )}
            {product?.productTags.nodes[0].name == "healthy snacks" && (
              <div className="h-full mx-auto relative z-10">
                <Image
                  src={product.productDisplayStyle.secondaryImage.sourceUrl}
                  fill={true}
                  priority
                  className="h-full mx-auto"
                ></Image>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row justify-between items-end">
            <p className="font-circe font-[900] text-erniegreen uppercase text-2xl">
              {product.name}
            </p>
            {product.name == "Grindswell Coffee" && (
              <div
                onClick={(e) => {
                  openCapacitorSite("https://groundswell.org.uk/");
                }}
              >
                <img
                  src="/Language icon wght200.svg"
                  className="w-10 h-10"
                ></img>
              </div>
            )}
          </div>
          <div className="w-full h-1.5 relative">
            <Image
              src="/divider.png"
              fill={true}
              className="min-w-[calc(100%-32px)] w-full h-1.5"
            ></Image>
          </div>
          <div className="">
            {product.productDisplayStyle.shortDescription ? (
              <div className="flex flex-col gap-0  border-erniegreen pb-3">
                {showFullDesc ? (
                  <p className="font-circular font-[500] text-sm text-erniegreen pt-1 lg:text-base lg:pt-4 lg:pb-5 lg:">
                    {product.description}
                  </p>
                ) : (
                  <p className="font-circular font-[500] text-sm text-erniegreen pt-1 lg:text-base lg:pt-4 lg:pb-5 lg:">
                    {product.productDisplayStyle.shortDescription}
                  </p>
                )}

                <p
                  className="font-circular font-[500] text-base text-erniegreen hover:text-erniegold cursor-pointer mt-2"
                  onClick={(e) => {
                    setShowingFullDesc(!showFullDesc);
                  }}
                >
                  {showFullDesc ? "Show less" : "Find out more"}
                </p>
              </div>
            ) : (
              <p className="font-circular font-[500] text-sm text-erniegreen pt-1 pb-3 lg:text-base lg:pt-4 lg:pb-2">
                {product.description}
              </p>
            )}
          </div>
          {product.name == "Spill Tea - 320 Bags (Case 4x80)" && (
            <div className="bg-ernieteal py-3 px-3 rounded-lg mb-2 flex lg:flex-row flex-col self-start lg:items-end lg:gap-4 gap-0">
              <p className="font-circe text-erniecream font-[900] uppercase text-2xl">
                Free Tin Included<span className="font-circular">*</span>
              </p>
              <p className="mb-1 font-circular text-erniecream text-[500] text-sm">
                *with your first order
              </p>
            </div>
          )}
          <div className="w-full h-[1px] bg-erniegreen"></div>
          {product.productTags.nodes[0].name == "containers" ||
          product.productTags.nodes[0].name == "machines" ||
          product.productTags.nodes[0].name == "cups/bottles" ? (
            <div></div>
          ) : (
            <div className="flex flex-col lg:mt-2 mb-2">
              <p
                className={`font-circular text-sm lg:text-base text-erniegreen`}
              >
                {product.productTags.nodes[0].name == "coffee" && (
                  <span className="font-[400]">
                    <span className="font-[900]">Taste notes:</span>{" "}
                    {product.coffeeExtraInfo.flavours}
                  </span>
                )}
                {product.productTags.nodes[0].name == "hot chocolate" && (
                  <span className="font-[400]">
                    <span className="font-[900]">Ingredients:</span>{" "}
                    {product.hotChocolateExtraInfo.ingredients}
                  </span>
                )}
                {product.productTags.nodes[0].name == "healthy snacks" && (
                  <span className="font-[400]">
                    <span className="font-[900]">Ingredients:</span>{" "}
                    {product.chocolateBarsExtraInfo.ingredients}
                  </span>
                )}
                {product.productTags.nodes[0].name == "tea" && (
                  <>
                    {product.teaExtraInfo.origin && (
                      <span className="font-[400]">
                        <span className="font-[900]">Origin:</span>{" "}
                        {product.teaExtraInfo.origin}
                      </span>
                    )}
                  </>
                )}
              </p>
              <p className="font-circular text-sm lg:text-base text-erniegreen">
                {product.productTags.nodes[0].name == "coffee" && (
                  <>
                    {product.coffeeExtraInfo.origin && (
                      <span className="font-[400]">
                        <span className="font-[900]">Origin:</span>{" "}
                        {product.coffeeExtraInfo.origin}
                      </span>
                    )}
                  </>
                )}
                {product.productTags.nodes[0].name == "hot chocolate" && (
                  <>
                    {product.hotChocolateExtraInfo.origin && (
                      <span className="font-[400]">
                        <span className="font-[900]">Origin:</span>{" "}
                        {product.hotChocolateExtraInfo.origin}
                      </span>
                    )}
                  </>
                )}
                {product.productTags.nodes[0].name == "tea" && (
                  <>
                    {product.teaExtraInfo.origin && (
                      <span className="font-[400]">
                        <span className="font-[900]">Elevation:</span>{" "}
                        {product.teaExtraInfo.elavation}
                      </span>
                    )}
                  </>
                )}
              </p>
              <p className="font-circular text-sm lg:text-base text-erniegreen">
                {product.productTags.nodes[0].name == "coffee" && (
                  <>
                    {product.coffeeExtraInfo.roast && (
                      <span className="font-[400]">
                        <span className="font-[900]">Roast:</span>{" "}
                        {product.coffeeExtraInfo.roast}
                      </span>
                    )}
                  </>
                )}
                {product.productTags.nodes[0].name == "tea" && (
                  <>
                    {product.teaExtraInfo.process && (
                      <span className="font-[400]">
                        <span className="font-[900]">Process:</span>{" "}
                        {product.teaExtraInfo.process}
                      </span>
                    )}
                  </>
                )}
                {product.productTags.nodes[0].name == "hot chocolate" && (
                  <span className="font-[400]">
                    <span className="font-[900] capitalize">Diet Type:</span>{" "}
                    {capitalizeFirstLetter(
                      product.chocolateBarsExtraInfo.dietType.toLowerCase()
                    )}
                  </span>
                )}
                {product.productTags.nodes[0].name == "healthy snacks" && (
                  <span className="font-[400]">
                    <span className="font-[900]">Diet Type:</span>{" "}
                    {capitalizeFirstLetter(
                      product.chocolateBarsExtraInfo.dietType.toLowerCase()
                    )}
                  </span>
                )}
              </p>
              <p className="font-circular text-sm lg:text-base text-erniegreen">
                {product.productTags.nodes[0].name == "healthy snacks" && (
                  <span className="font-[400]">
                    <span className="font-[900]">Allergens:</span>{" "}
                    {product.chocolateBarsExtraInfo.allergens}
                  </span>
                )}
              </p>
              <p className="font-circular text-sm lg:text-base text-erniegreen">
                {product.productTags.nodes[0].name == "healthy snacks" && (
                  <span className="font-[400]">
                    <span className="font-[900]">Health Claims:</span>{" "}
                    {product.chocolateBarsExtraInfo.health}
                  </span>
                )}
              </p>

              <p className="font-circular text-sm lg:text-base text-erniegreen">
                {product.productTags.nodes[0].name == "tea" && (
                  <>
                    {product.teaExtraInfo.flavours && (
                      <span className="font-[400]">
                        <span className="font-[900]">Flavours:</span>{" "}
                        {product.teaExtraInfo.flavours}
                      </span>
                    )}
                  </>
                )}
              </p>
              {product.teaExtraInfo?.packaging && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                  <div className="flex flex-col">
                    <p className="font-circe font-[900] text-erniegreen uppercase text-xl">
                      How To Drink
                    </p>
                    <div className="w-full h-1 relative">
                      <Image
                        src="/divider.png"
                        fill={true}
                        className="min-w-[calc(100%-32px)] w-full h-1.5"
                      ></Image>
                    </div>
                    <div className="flex flex-col font-circular font-[500] text-sm text-erniegreen pt-1 lg:text-base lg:pt-4 lg:pb-5">
                      {howToDrink(product).map((item, index) => (
                        <div key={index}>
                          <p>{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <p className="font-circe font-[900] text-erniegreen uppercase text-xl">
                      Packaging
                    </p>
                    <div className="w-full h-1 relative">
                      <Image
                        src="/divider.png"
                        fill={true}
                        className="min-w-[calc(100%-32px)] w-full h-1.5"
                      ></Image>
                    </div>
                    <div className="flex flex-col font-circular font-[500] text-sm text-erniegreen pt-1 lg:text-base lg:pt-4 lg:pb-5">
                      {product.teaExtraInfo.packaging}
                    </div>
                  </div>
                </div>
              )}
              <p
                className={`font-circular text-sm text-erniegreen ${
                  product.coffeeExtraInfo.varietal != "-" &&
                  product.coffeeExtraInfo.varietal != null
                    ? "flex"
                    : "hidden"
                }`}
              >
                <span className="font-[900]">Varietal: </span>
                {product.coffeeExtraInfo.varietal}
              </p>
            </div>
          )}
          {console.log(product)}
          {product.type == "VARIABLE" && pType != -1 && (
            <div className="flex flex-col gap-4 mb-4">
              {product.attributes?.nodes.map((attribute, index) => (
                <div className="flex flex-col gap-2" key={index}>
                  <label
                    htmlFor={attribute.name.toLowerCase()}
                    className="font-circular text-erniegreen text-sm"
                  >
                    {attribute.name}
                  </label>
                  <select
                    id={attribute.name.toLowerCase()}
                    name={attribute.name.toLowerCase()}
                    defaultValue={
                      attribute.name.toLowerCase() == "size"
                        ? selectedSize
                        : selectedType
                    }
                    className="bg-erniedarkcream rounded-lg p-2 font-circular text-erniegreen outline-none"
                    onChange={(e) => {
                      let temp = selectedVariants;

                      temp[attribute.name.toLowerCase()] =
                        e.currentTarget.value;

                      setSelectedVariants(temp);

                      if (attribute.name.toLowerCase() == "size") {
                        setSelectedSize(
                          e.currentTarget.value == 0 ? "1kg Tub" : "4kg Bucket"
                        );
                      } else {
                        setSelectedType(
                          e.currentTarget.value == 0 ? "Beans" : "Ground"
                        );
                      }

                      console.log(temp);

                      console.log(
                        findVariant(
                          product.variations.nodes,
                          Array.from(Object.values(temp))
                        )
                      );

                      console.log(
                        product.variations.nodes[
                          findVariant(
                            product.variations.nodes,
                            Array.from(Object.values(temp))
                          )
                        ]
                      );

                      setSelectedVariant(
                        product.variations.nodes[
                          findVariant(
                            product.variations.nodes,
                            Array.from(Object.values(temp))
                          )
                        ]
                      );
                    }}
                  >
                    {attribute.options.map((option, oIndex) => (
                      <option key={oIndex} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}
          {product.productDisplayStyle.allowOrdering == true && (
            <div
              className={`bg-erniedarkcream p-6 rounded-lg ${
                pType == -1 ? "hidden" : "lg:flex hidden "
              }`}
            >
              {pType == 0 && (
                <div className="hidden lg:flex w-full flex-grow">
                  <div className="rounded-xl mt-0 w-full">
                    <div className="flex flex-col gap-4 order-b-[1px] border-erniegreen">
                      <div className="w-full flex flex-row gap-6">
                        <div
                          className="bg-erniegreen p-1 rounded-lg flex-grow"
                          onClick={() => {
                            if (oneOffQuantity > 1) {
                              setOneOffQuantity(oneOffQuantity - 1);
                            }
                          }}
                        >
                          <p className="font-circular text-center text-erniecream text-xl">
                            -
                          </p>
                        </div>
                        <p className="font-circe font-erniegreen font-[900] self-center w-10 text-center lg:text-lg">
                          {oneOffQuantity}
                        </p>
                        <div
                          className="bg-erniegreen p-1 rounded-lg flex-grow"
                          onClick={() => {
                            setOneOffQuantity(oneOffQuantity + 1);
                          }}
                        >
                          <p className="font-circular text-center text-erniecream text-xl">
                            +
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-row justify-between gap-8">
                        <p className="font-circe font-[900] text-erniegreen text-2xl lg:text-3xl">
                          {console.log(selectedVariant)}
                          {product.type == "SIMPLE"
                            ? product.price == null
                              ? "£0.00"
                              : product.price
                            : selectedVariant?.price}
                        </p>
                        <div
                          className="bg-erniegold rounded-xl w-full lg:w-auto p-2 lg:py-2 lg:px-4 flex flex-row justify-center items-center cursor-pointer"
                          onClick={() => {
                            setAddingToOBasket(true);

                            addToOneOffBasket({
                              product: product,
                              quantity: oneOffQuantity,
                              selectedVariant: selectedVariant,
                            });

                            console.log(addingToOBasket);
                          }}
                        >
                          {addingToOBasket && (
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
                          <p className="font-circe font-[900] text-erniegreen text-center lg:text-lg">
                            Add to basket
                          </p>
                        </div>
                      </div>
                      <p className="font-circular text-erniegreen italic text-xs lg:text-sm">
                        You save 50p per kg when you subscribe!
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {pType == 1 && (
                <div className="hidden lg:flex">
                  <div className="rounded-xl">
                    <div className="flex flex-col gap-4 py-4">
                      <div className="w-full flex flex-row gap-6">
                        <div
                          className="bg-erniegreen p-1 rounded-lg flex-grow"
                          onClick={() => {
                            if (subQuantity > 1) {
                              setSubQuantity(subQuantity - 1);
                            }
                          }}
                        >
                          <p className="font-circular text-center text-erniecream text-xl">
                            -
                          </p>
                        </div>
                        <p className="font-circe font-erniegreen font-[900] self-center w-10 text-center">
                          {subQuantity +
                            " " +
                            (product.productDisplayStyle.priceSuffix
                              ? product.productDisplayStyle.priceSuffix
                              : "")}
                        </p>
                        <div
                          className="bg-erniegreen p-1 rounded-lg flex-grow"
                          onClick={() => {
                            setSubQuantity(subQuantity + 1);
                          }}
                        >
                          <p className="font-circular text-center text-erniecream text-xl">
                            +
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-row justify-between gap-8">
                        <p className="font-circe font-[900] text-erniegreen text-2xl">
                          Hi
                          {product.type == "SIMPLE"
                            ? product.price == null
                              ? "£0.00"
                              : product.price
                            : selectedVariant?.price}
                        </p>
                        <div
                          className="bg-erniegold rounded-xl w-full p-2 flex flex-row justify-center items-center cursor-pointer"
                          onClick={() => {
                            setAddingToSBasket(true);

                            addToSubBasket({
                              product: product,
                              quantity: subQuantity,
                              selectedVariant: selectedVariant,
                            });
                          }}
                        >
                          {addingToSBasket && (
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
                          <p className="font-circe font-[900] text-erniegreen text-center">
                            Add to basket
                          </p>
                        </div>
                      </div>
                      <p className="font-circular text-erniegreen italic text-xs">
                        You save 50p per kg when you subscribe!
                      </p>
                      <p className="font-circular text-erniegreen italic text-xs font-[500]">
                        You will be able to choose your subscription frequency
                        at checkout. If you already have a subscription with us,
                        this will automatically be added onto your next order.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {console.log(product.productDisplayStyle.allowOrdering)}
      {product.productDisplayStyle.allowOrdering == true && (
        <div>
          {pType == 0 && (
            <div className="flex w-full lg:hidden">
              <div className="bg-erniecream rounded-xl p-6 mb-0 w-full">
                <div className="flex flex-col gap-4 order-b-[1px] border-erniegreen">
                  <div className="w-full flex flex-row gap-6">
                    <div
                      className="bg-erniedarkcream p-1 rounded-lg flex-grow"
                      onClick={() => {
                        if (oneOffQuantity > 1) {
                          setOneOffQuantity(oneOffQuantity - 1);
                        }
                      }}
                    >
                      <p className="font-circular text-center text-erniegreen text-xl">
                        -
                      </p>
                    </div>
                    <p className="font-circe font-erniegreen font-[900] self-center w-10 text-center">
                      {oneOffQuantity +
                        " " +
                        (product.productDisplayStyle.priceSuffix
                          ? product.productDisplayStyle.priceSuffix
                          : "")}
                    </p>
                    <div
                      className="bg-erniedarkcream p-1 rounded-lg flex-grow"
                      onClick={() => {
                        setOneOffQuantity(oneOffQuantity + 1);
                      }}
                    >
                      <p className="font-circular text-center text-erniegreen text-xl">
                        +
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-row justify-between gap-8">
                    <p className="font-circe font-[900] text-erniegreen text-2xl">
                      {console.log(selectedVariant)}
                      {product.type == "SIMPLE"
                        ? product.price == null
                          ? "£0.00"
                          : product.price
                        : selectedVariant?.price}
                    </p>
                    <div
                      className="bg-erniegold rounded-xl w-full p-2 flex flex-row justify-center items-center cursor-pointer"
                      onClick={() => {
                        setAddingToOBasket(true);

                        addToOneOffBasket({
                          product: product,
                          quantity: oneOffQuantity,
                          selectedVariant: selectedVariant,
                        });

                        console.log(addingToOBasket);
                      }}
                    >
                      {addingToOBasket && (
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
                      <p className="font-circe font-[900] text-erniegreen text-center">
                        Add to basket
                      </p>
                    </div>
                  </div>
                  <p className="font-circular text-erniegreen italic text-xs">
                    You save 50p per kg when you subscribe!
                  </p>
                </div>
              </div>
            </div>
          )}
          {pType == 1 && (
            <div className="flex w-full lg:hidden">
              <div className="bg-erniecream rounded-xl p-6 mb-0 w-full">
                <div className="flex flex-col gap-4 py-4">
                  <div className="w-full flex flex-row gap-6">
                    <div
                      className="bg-erniedarkcream p-1 rounded-lg flex-grow"
                      onClick={() => {
                        if (subQuantity > 1) {
                          setSubQuantity(subQuantity - 1);
                        }
                      }}
                    >
                      <p className="font-circular text-center text-erniegreen text-xl">
                        -
                      </p>
                    </div>
                    <p className="font-circe font-erniegreen font-[900] self-center w-10 text-center">
                      {subQuantity +
                        " " +
                        (product.productDisplayStyle.priceSuffix
                          ? product.productDisplayStyle.priceSuffix
                          : "")}
                    </p>
                    <div
                      className="bg-erniedarkcream p-1 rounded-lg flex-grow"
                      onClick={() => {
                        setSubQuantity(subQuantity + 1);
                      }}
                    >
                      <p className="font-circular text-center text-erniegreen text-xl">
                        +
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-row justify-between gap-8">
                    <p className="font-circe font-[900] text-erniegreen text-2xl">
                      {product.type == "SIMPLE"
                        ? product.price == null
                          ? "£0.00"
                          : product.price
                        : selectedVariant?.price}
                    </p>
                    <div
                      className="bg-erniegold rounded-xl w-full p-2 flex flex-row justify-center items-center cursor-pointer"
                      onClick={() => {
                        setAddingToSBasket(true);

                        addToSubBasket({
                          product: product,
                          quantity: subQuantity,
                          selectedVariant: selectedVariant,
                        });
                      }}
                    >
                      {addingToSBasket && (
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
                      <p className="font-circe font-[900] text-erniegreen text-center">
                        Add to basket
                      </p>
                    </div>
                  </div>
                  <p className="font-circular text-erniegreen italic text-xs">
                    You save 50p per kg when you subscribe!
                  </p>
                  <p className="font-circular text-erniegreen italic text-xs font-[500]">
                    You will be able to choose your subscription frequency at
                    checkout. If you already have a subscription with us, this
                    will automatically be added onto your next order.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
