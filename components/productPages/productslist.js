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

  return (
    <div className={`${role == 1 ? "h-[93%]" : "h-full"} w-full flex`}>
      {previewingProduct == false && (
        <div className="flex flex-col gap-4 pb-8 pt-20 w-full">
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
          <div className="bg-erniecream w-full h-full px-4 py-4 grid grid-cols-2 gap-4">
            {filter().map((product, index) => (
              <div
                key={index}
                className="flex flex-col gap-8"
                onClick={() => {
                  setSelectedProduct(index);
                  setPreviewingProduct(true);
                }}
              >
                <div className="relative">
                  <Image
                    src={product.image.sourceUrl}
                    width={144}
                    height={144}
                    priority
                    className="w-36 h-36 object-contain mx-auto"
                  ></Image>
                  {product.productDisplayStyle.badgeImage?.sourceUrl && (
                    <Image
                      src={product.productDisplayStyle.badgeImage?.sourceUrl}
                      width={64}
                      height={64}
                      priority
                      className="absolute w-16 right-0 -bottom-4 rounded-full"
                    ></Image>
                  )}
                </div>
                <div className="bg-erniegreen p-2 h-16 flex flex-col justify-center">
                  <p className="text-center text-erniecream text-sm uppercase font-circe font-[900]">
                    {product.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
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
