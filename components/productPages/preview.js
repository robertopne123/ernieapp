import { useMutation } from "@apollo/client";
import Image from "next/image";
import CartContext from "../context/cart-context";

export default function Preview({
  selected,
  products,
  backAction,
  role,
  addToBasket,
  category,
}) {
  const addToBasketFromPreviewPage = (item, category) => {
    addToBasket(item, category);
  };

  return (
    <div
      className={`flex flex-col h-full w-full overflow-auto bg-erniecream ${
        role == 1 && "pb-8"
      }`}
    >
      {console.log(products[selected])}
      <div className="absolute mt-1 z-20 h-[70px]" onClick={backAction}>
        <div className="w-6 h-6 relative">
          <Image
            src="/left-arrow-cream.svg"
            fill={true}
            className="w-6 ml-6 mt-5 mt-1"
          ></Image>
        </div>
      </div>
      <div className="w-full bg-cover min-h-[55%] py-10 relative">
        <div className="w-full h-full absolute top-0 z-0">
          <div className="w-full h-full relative">
            <Image
              src={products[selected].productDisplayStyle.bgImage.sourceUrl}
              fill={true}
              priority
              objectFit="cover"
            ></Image>
          </div>
        </div>
        <div className="z-10 h-full">
          {products[selected].productTags.nodes[0].name !=
            "squirrel sisters" && (
            <div className="h-full mx-auto relative z-10">
              <Image
                src={products[selected].image.sourceUrl}
                className="h-full mx-auto"
                fill={true}
                priority
                style={{ objectFit: "contain" }}
              ></Image>
            </div>
          )}
          {products[selected].productTags.nodes[0].name ==
            "squirrel sisters" && (
            <div className="h-full mx-auto relative z-10">
              <Image
                src={
                  products[selected].productDisplayStyle.secondaryImage
                    .sourceUrl
                }
                fill={true}
                priority
                className="h-full mx-auto"
              ></Image>
            </div>
          )}
        </div>
      </div>
      <div className="px-8 py-12 flex flex-col gap-6 flex-shrink">
        <p className="font-circe font-[900] text-erniegreen uppercase text-3xl">
          {products[selected].name}
        </p>
        <div className="w-full h-1.5 relative">
          <Image
            src="/divider.png"
            fill={true}
            className="min-w-[calc(100%-32px)] w-full h-1.5"
          ></Image>
        </div>
        {category != "cups/bottles" && (
          <p className="font-circular font-[500] text-erniegreen">
            {products[selected].description}
          </p>
        )}
        <p className="font-circe font-[900] text-erniegreen text-3xl">
          {products[selected].price == null
            ? "£0.00"
            : products[selected].price}
        </p>
        {category != "cups/bottles" && (
          <div className="flex flex-col border-2 border-erniegreen">
            <div className="flex flex-col border-b-[1px] border-erniegreen p-2">
              <p className="font-circular font-[500] text-erniegreen text-center">
                {products[selected].productTags.nodes[0].name == "coffee" &&
                  products[selected].coffeeExtraInfo.flavours}{" "}
                {products[selected].productTags.nodes[0].name ==
                  "hot chocolate" &&
                  products[selected].hotChocolateExtraInfo.ingredients}{" "}
                {products[selected].productTags.nodes[0].name ==
                  "squirrel sisters" &&
                  products[selected].chocolateBarsExtraInfo.ingredients}
              </p>
            </div>
            <div className="flex flex-row border-t-[1px] border-erniegreen">
              <div className="w-1/2 flex flex-col border-r-[1px] border-erniegreen p-2 justify-center">
                <p className="font-circular font-[500] text-erniegreen text-center">
                  {products[selected].productTags.nodes[0].name == "coffee" &&
                    `Origin: ${products[selected].coffeeExtraInfo.flavours}`}{" "}
                  {products[selected].productTags.nodes[0].name ==
                    "hot chocolate" &&
                    `Origin: ${products[selected].hotChocolateExtraInfo.ingredients}`}{" "}
                  {products[selected].productTags.nodes[0].name ==
                    "squirrel sisters" &&
                    `${products[selected].chocolateBarsExtraInfo.calories} Calories`}
                </p>
              </div>
              <div className="w-1/2 flex flex-col border-l-[1px] border-erniegreen p-2 justify-center">
                <p className="font-circular font-[500] text-erniegreen text-center">
                  {products[selected].productTags.nodes[0].name == "coffee" &&
                    `Roast: ${products[selected].coffeeExtraInfo.roast}`}{" "}
                  {products[selected].productTags.nodes[0].name ==
                    "hot chocolate" &&
                    products[
                      selected
                    ].hotChocolateExtraInfo.dietType.toUpperCase()}{" "}
                  {products[selected].productTags.nodes[0].name ==
                    "squirrel sisters" &&
                    products[
                      selected
                    ].chocolateBarsExtraInfo.dietType.toUpperCase()}
                </p>
              </div>
            </div>
            <div
              className={`flex-col border-t-[2px] border-erniegreen p-2 ${
                products[selected].coffeeExtraInfo.varietal != "-" &&
                products[selected].coffeeExtraInfo.varietal != null
                  ? "flex"
                  : "hidden"
              }`}
            >
              <p className="font-circular font-[500] text-erniegreen text-center">
                {products[selected].coffeeExtraInfo.varietal}
              </p>
            </div>
          </div>
        )}
        <div className="bg-erniegreen p-4">
          <p className="font-circular text-erniecream font-[500] text-center">
            Available as{" "}
            {products[selected].productTags.nodes[0].name == "coffee" &&
              products[selected].coffeeExtraInfo.type}{" "}
            {products[selected].productTags.nodes[0].name == "hot chocolate" &&
              products[selected].hotChocolateExtraInfo.type}{" "}
            {products[selected].productTags.nodes[0].name ==
              "squirrel sisters" &&
              products[selected].chocolateBarsExtraInfo.type}
            {products[selected].productTags.nodes[0].name == "cups/bottles" &&
              "Single Units"}
          </p>
        </div>
        {role == 1 && (
          <div
            className="bg-erniegreen p-4"
            onClick={(e) => {
              addToBasketFromPreviewPage(products[selected], category);
            }}
          >
            <p className="font-circular text-erniecream font-[500] text-center">
              Add To Order
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
