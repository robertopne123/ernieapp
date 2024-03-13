import { useState } from "react";
import Preview from "./preview";
import Image from "next/image";

export default function ProductLists({
  products,
  category,
  backAction,
  role,
  addToBasket,
  hideBasket,
}) {
  function filter() {
    let filtered = [];

    console.log(products);

    for (let i = 0; i < products.length; i++) {
      //Remove legacy products
      if (products[i].productTags.nodes[0].name == category) {
        filtered.push(products[i]);
      }
    }

    return filtered;
  }

  const [previewingProduct, setPreviewingProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(-1);

  const previewBack = () => {
    setPreviewingProduct(false);
    hideBasket();
  };

  const addToBasketFromProductListPage = (item, category) => {
    addToBasket(item, category);
  };

  const [displayView, setDisplayView] = useState("grid");

  return (
    <div className={`${role == 1 ? "h-[93%]" : "h-full"} w-full flex`}>
      {previewingProduct == false && (
        <div className="flex flex-col gap-4 pb-0 pt-20 w-full">
          <div
            className="absolute top-0 left-0 px-6 py-4 bg-erniemint w-full h-[70px] flex flex-row items-center justify-between"
            onClick={backAction}
          >
            <div className="h-6 w-6 relative">
              <Image src="/left-arrow.svg" fill={true} className="h-6"></Image>
            </div>
            <p className="uppercase font-circe font-[900] text-center text-3xl line-[36px] mt-2 text-erniegreen">
              {category}
            </p>
          </div>
          <div className="flex flex-row justify-end gap-2 px-6">
            <div
              onClick={() => {
                setDisplayView("grid");
              }}
            >
              {displayView == "grid" ? (
                <img
                  src="/grid-cream.svg"
                  className="w-10 bg-erniegreen rounded-md"
                />
              ) : (
                <img src="/grid.svg" className="w-10" />
              )}
            </div>
            <div
              onClick={() => {
                setDisplayView("list");
              }}
            >
              {displayView == "list" ? (
                <img
                  src="/list-cream.svg"
                  className="w-10 bg-erniegreen rounded-md"
                />
              ) : (
                <img src="/list.svg" className="w-10" />
              )}
            </div>
          </div>
          {displayView == "grid" && (
            <div className="bg-erniecream w-full h-full px-4 py-4 grid grid-cols-2 gap-4 overflow-auto">
              {filter().map((product, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-8"
                  onClick={() => {
                    setSelectedProduct(index);
                    setPreviewingProduct(true);
                  }}
                >
                  <div className="relative w-36 mx-auto">
                    <Image
                      src={product.image.sourceUrl}
                      width={144}
                      height={144}
                      priority
                      className={`w-36 h-36 object-contain mx-auto ${
                        category == "squirrel sisters" && "scale-[1.3]"
                      }`}
                    ></Image>
                    {product.productDisplayStyle.badgeImage?.sourceUrl && (
                      <Image
                        src={product.productDisplayStyle.badgeImage?.sourceUrl}
                        width={64}
                        height={64}
                        priority
                        className="absolute w-16 -right-4 -bottom-0 rounded-full"
                      ></Image>
                    )}
                  </div>
                  <div className="bg-erniegreen p-2 mdmb:h-16 h-20 flex flex-col justify-center">
                    <p className="text-center text-erniecream text-sm  xlmb:text-lg uppercase font-circe font-[900]">
                      {product.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {displayView == "list" && (
            <div className="bg-erniecream w-full h-full px-4 pt-4 pb-12 flex flex-col gap-6 overflow-auto">
              {filter().map((product, index) => (
                <div key={index} className="flex flex-col">
                  <div
                    className="flex flex-row gap-8 px-4"
                    onClick={() => {
                      setSelectedProduct(index);
                      setPreviewingProduct(true);
                    }}
                  >
                    <div className="relative w-24 min-w-24 aspect-square">
                      <Image
                        src={
                          category != "cups/bottles"
                            ? product.productDisplayStyle.badgeImage?.sourceUrl
                            : product.image.sourceUrl
                        }
                        width={144}
                        height={144}
                        priority
                        className={`w-24 h-24 min-w-24 object-contain mx-auto rounded-full`}
                      ></Image>
                    </div>
                    <div className="flex flex-col w-auto justify-center col-span-2 h-full">
                      <p className="text-erniegreen text-lg xlmb:text-2xl mdmb:text-xl uppercase font-circe font-[900]">
                        {product.name}
                      </p>
                    </div>
                  </div>
                  <img
                    src="/divider.png"
                    className={`mt-8 ${
                      index == filter().length - 1 && "hidden"
                    }`}
                  ></img>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {previewingProduct == true && (
        <div className="h-full w-full">
          <Preview
            selected={selectedProduct}
            products={filter()}
            backAction={previewBack}
            role={role}
            addToBasket={addToBasketFromProductListPage}
            category={category}
          />
        </div>
      )}
    </div>
  );
}
