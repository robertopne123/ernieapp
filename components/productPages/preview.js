import { useMutation } from "@apollo/client";
import Image from "next/image";
import CartContext from "../context/cart-context";
import { useState } from "react";

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
}) {
  const addToBasketFromPreviewPage = (item, category) => {
    addToBasket(item, category);
  };

  const [purchaseType, setPurchaseType] = useState(-1);

  const [subQuantity, setSubQuantity] = useState(1);

  const [oneOffQuantity, setOneOffQuantity] = useState(1);

  return (
    <div
      className={`absolute top-0 flex flex-col gap-6 h-full w-full overflow-auto bg-erniedarkcream pb-16 px-6`}
    >
      <div
        className="py-2 flex flex-row items-center gap-1 border-b-[1px] border-erniegreen cursor-pointer"
        onClick={backAction}
      >
        <div className="h-3 w-3 relative">
          <Image src="/left-arrow.svg" fill={true} className="h-6"></Image>
        </div>
        <p className="font-circular font-[500] text-center text-sm text-erniegreen">
          Back
        </p>
      </div>
      <div className="flex flex-col gap-6 bg-erniecream rounded-xl p-6 h-auto ">
        <div className="w-full bg-cover h-[300px] relative">
          <div className="z-10 h-[300px]">
            {product.productTags.nodes[0].name != "squirrel sisters" && (
              <div className="h-full mx-auto relative z-10">
                <Image
                  src={product.image.sourceUrl}
                  className="h-full mx-auto"
                  fill={true}
                  priority
                  style={{ objectFit: "contain" }}
                ></Image>

                <Image
                  src={product.productDisplayStyle.badgeImage.sourceUrl}
                  width={100}
                  height={100}
                  priority
                  className="w-30 absolute bottom-0 right-0 rounded-full"
                />
              </div>
            )}
            {product.productTags.nodes[0].name == "squirrel sisters" && (
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
          <p className="font-circe font-[900] text-erniegreen uppercase text-2xl">
            {product.name}
          </p>
          <div className="w-full h-1.5 relative">
            <Image
              src="/divider.png"
              fill={true}
              className="min-w-[calc(100%-32px)] w-full h-1.5"
            ></Image>
          </div>
          {category != "cups/bottles" && (
            <p className="font-circular font-[500] text-sm text-erniegreen pt-1 pb-3 border-b-[1px] border-erniegreen">
              {product.description}
            </p>
          )}
          <div className="flex flex-col">
            <p className="font-circular text-sm text-erniegreen">
              <span className="font-[900]">Taste notes: </span>
              {product.productTags.nodes[0].name == "coffee" &&
                product.coffeeExtraInfo.flavours}{" "}
              {product.productTags.nodes[0].name == "hot chocolate" &&
                product.hotChocolateExtraInfo.ingredients}{" "}
              {product.productTags.nodes[0].name == "squirrel sisters" &&
                product.chocolateBarsExtraInfo.ingredients}
            </p>
            <p className="font-circular text-sm text-erniegreen">
              <span className="font-[900]">Origin: </span>
              {product.productTags.nodes[0].name == "coffee" &&
                product.coffeeExtraInfo.origin}{" "}
              {product.productTags.nodes[0].name == "hot chocolate" &&
                product.hotChocolateExtraInfo.origin}{" "}
              {product.productTags.nodes[0].name == "squirrel sisters" &&
                product.chocolateBarsExtraInfo.origin}
            </p>
            <p className="font-circular text-sm text-erniegreen">
              <span className="font-[900]">
                {product.productTags.nodes[0].name == "coffee"
                  ? "Roast: "
                  : "Diet Type: "}
              </span>
              {product.productTags.nodes[0].name == "coffee" &&
                product.coffeeExtraInfo.roast}{" "}
              {product.productTags.nodes[0].name == "hot chocolate" &&
                product.hotChocolateExtraInfo.dietType}{" "}
              {product.productTags.nodes[0].name == "squirrel sisters" &&
                product.chocolateBarsExtraInfo.dietType}
            </p>
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
        </div>
      </div>
      <div className="flex flex-col bg-erniecream rounded-xl mb-10 p-6">
        <p className="font-circular font-[300] text-erniegreen text-sm italic">
          Required
        </p>
        <div className="flex flex-row justify-between gap-2 py-1">
          <label
            htmlFor="purchasetype"
            className="font-circe font-[900] text-erniegreen uppercase"
          >
            Add To Subscription
          </label>
          <input
            type="radio"
            name="purchasetype"
            className="w-6 accent-erniegreen"
            onClick={() => {
              setPurchaseType(0);
            }}
          ></input>
        </div>
        {purchaseType == 0 && (
          <div className="flex flex-col gap-4 py-4 border-b-[1px] border-erniegreen mb-4">
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
                {subQuantity + "kg"}
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
                {product.price == null ? "£0.00" : product.price}
              </p>
              <div
                className="bg-erniegold rounded-xl py-1 px-3 flex-grow"
                onClick={() =>
                  addToSubBasket({ product: product, quantity: subQuantity })
                }
              >
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
              checkout. If you already have a subscription with us, this will
              automatically be added onto your next order.
            </p>
          </div>
        )}
        <div className="flex flex-row justify-between gap-2 py-1">
          <label
            htmlFor="purchasetype"
            className="font-circe font-[900] text-erniegreen uppercase"
          >
            One Off Purchase
          </label>
          <input
            type="radio"
            name="purchasetype"
            className="w-6 accent-erniegreen"
            onClick={() => {
              setPurchaseType(1);
            }}
          ></input>
        </div>
        {purchaseType == 1 && (
          <div className="flex flex-col gap-4 py-4 border-b-[1px] border-erniegreen mb-4">
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
                {oneOffQuantity + "kg"}
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
                {product.price == null ? "£0.00" : product.price}
              </p>
              <div
                className="bg-erniegold rounded-xl py-1 px-3 flex-grow"
                onClick={() =>
                  addToOneOffBasket({
                    product: product,
                    quantity: oneOffQuantity,
                  })
                }
              >
                <p className="font-circe font-[900] text-erniegreen text-center">
                  Add to basket
                </p>
              </div>
            </div>
            <p className="font-circular text-erniegreen italic text-xs">
              You save 50p per kg when you subscribe!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
