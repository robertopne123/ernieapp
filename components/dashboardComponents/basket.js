import { useState } from "react";
import Image from "next/image";
export const Basket = ({
  addToSubBasket,
  addToOneOffBasket,
  updateSubBasket,
  updateOneOffBasket,
  setNewSubFrequency,
  newSubFreq,
  subBasket,
  oneOffBasket,
}) => {
  const [showingBasket, setShowingBasket] = useState(false);

  const [showingCheckout, setShowingCheckout] = useState(false);

  const decSubQuantity = (index) => {
    let subBasketCopy = [...subBasket];

    if (subBasketCopy[index].quantity > 1) {
      subBasketCopy[index].quantity = subBasketCopy[index].quantity - 1;
    }

    updateSubBasket(subBasketCopy);
  };

  const incSubQuantity = (index) => {
    let subBasketCopy = [...subBasket];

    subBasketCopy[index].quantity = subBasketCopy[index].quantity + 1;

    updateSubBasket(subBasketCopy);
  };

  const decOneOffQuantity = (index) => {
    let oneOffBasketCopy = [...oneOffBasket];

    if (oneOffBasketCopy[index].quantity > 1) {
      oneOffBasketCopy[index].quantity = oneOffBasketCopy[index].quantity - 1;
    }

    updateOneOffBasket(oneOffBasketCopy);
  };

  const incOneOffQuantity = (index) => {
    let oneOffBasketCopy = [...oneOffBasket];

    oneOffBasketCopy[index].quantity = oneOffBasketCopy[index].quantity + 1;

    updateOneOffBasket(oneOffBasketCopy);
  };

  const getSubSubtotal = () => {
    let subtotal = 0;

    for (let i = 0; i < subBasket.length; i++) {
      subtotal =
        subtotal +
        parseFloat(subBasket[i].product.price.replace("£", "")) *
          subBasket[i].quantity;
    }

    return subtotal;
  };

  const getOneOffSubtotal = () => {
    let subtotal = 0;

    for (let i = 0; i < oneOffBasket.length; i++) {
      subtotal =
        subtotal +
        parseFloat(oneOffBasket[i].product.price.replace("£", "")) *
          oneOffBasket[i].quantity;
    }

    return subtotal;
  };

  const backAction = () => {
    setShowingCheckout(false);
  };

  const paymentOptions = [
    { image: "/Visa_Inc._logo.svg" },
    { image: "/Paypal.svg" },
    { image: "/Apple_Pay_logo.svg" },
    { image: "/Google_Pay_Logo.svg" },
    { image: "/erniesmall.svg" },
  ];

  const [selectedPayment, setSelectedPayment] = useState(0);

  return (
    <div className="flex flex-col justify-center z-[999]">
      <div className="relative">
        <img
          src="/ERNIE_APP_ICON_CART_V1.png"
          className="w-10"
          onClick={() => setShowingBasket(!showingBasket)}
        ></img>
        <p className="font-circular text-erniecream absolute left-1/2 translate-x-[-50%] -translate-y-[27px] pointer-events-none">
          {subBasket?.length ? subBasket?.length + oneOffBasket?.length : 0}
        </p>
      </div>
      {showingBasket && (
        <>
          {showingCheckout ? (
            <div className="absolute right-0 top-20 h-auto w-full bg-erniedarkcream px-6 z-[999] pb-6 flex flex-col gap-4">
              <div
                className="py-2 flex flex-row items-center gap-1 border-b-[1px] border-erniegreen cursor-pointer"
                onClick={() => {
                  backAction();
                }}
              >
                <div className="h-3 w-3 relative">
                  <Image
                    src="/left-arrow.svg"
                    fill={true}
                    className="h-6"
                  ></Image>
                </div>
                <p className="font-circular font-[500] text-center text-sm text-erniegreen">
                  Back
                </p>
              </div>
              <div className="bg-erniecream rounded-xl p-6 flex flex-col">
                <p className="font-circe text-xl text-erniegreen font-[900] uppercase">
                  Your Details
                </p>
                <img src="/divider.png" className=" w-full mt-2"></img>
                <div className="flex flex-col gap-4 mt-4">
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="businessname"
                      className="font-circular text-erniegreen text-sm font-[500]"
                    >
                      Name of Company *
                    </label>
                    <input
                      type="text"
                      name="businessname"
                      onChange={(e) => {
                        // setRBusinessName(e.currentTarget.value);
                      }}
                      className="bg-erniecream h-10 font-circular font-[500] px-4 text-erniegreen border-[1px] border-erniegreen rounded-lg outline-erniegold outline-[1px]"
                    ></input>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="address"
                      className="font-circular text-erniegreen text-sm font-[500]"
                    >
                      Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      onChange={(e) => {
                        // setRBusinessName(e.currentTarget.value);
                      }}
                      className="bg-erniecream h-10 font-circular font-[500] px-4 text-erniegreen border-[1px] border-erniegreen rounded-lg outline-erniegold outline-[1px]"
                    ></input>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="postcode"
                      className="font-circular text-erniegreen text-sm font-[500]"
                    >
                      Postcode *
                    </label>
                    <input
                      type="text"
                      name="postcode"
                      onChange={(e) => {
                        // setRBusinessName(e.currentTarget.value);
                      }}
                      className="bg-erniecream h-10 font-circular font-[500] px-4 text-erniegreen border-[1px] border-erniegreen rounded-lg outline-erniegold outline-[1px]"
                    ></input>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="contactnumber"
                      className="font-circular text-erniegreen text-sm font-[500]"
                    >
                      Contact Number *
                    </label>
                    <input
                      type="text"
                      name="contactnumber"
                      onChange={(e) => {
                        // setRBusinessName(e.currentTarget.value);
                      }}
                      className="bg-erniecream h-10 font-circular font-[500] px-4 text-erniegreen border-[1px] border-erniegreen rounded-lg outline-erniegold outline-[1px]"
                    ></input>
                  </div>
                </div>
              </div>
              <div className="bg-erniecream rounded-xl p-6 flex flex-col">
                <p className="font-circe text-xl text-erniegreen font-[900] uppercase">
                  Vouchers & Discounts
                </p>
                <img src="/divider.png" className=" w-full mt-2"></img>
                <div className="flex flex-col gap-4 mt-4">
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      name="voucher"
                      placeholder="Enter code here"
                      onChange={(e) => {
                        // setRBusinessName(e.currentTarget.value);
                      }}
                      className="bg-erniecream h-10 font-circular font-[500] px-4 text-erniegreen border-[1px] border-erniegreen rounded-lg outline-erniegold outline-[1px]"
                    ></input>
                  </div>
                </div>
              </div>
              <div className="bg-erniecream rounded-xl p-6 flex flex-col">
                <p className="font-circe text-xl text-erniegreen font-[900] uppercase">
                  Payment Options
                </p>
                <img src="/divider.png" className=" w-full mt-2"></img>
                <div className="flex flex-col gap-2 mt-4">
                  {paymentOptions.map((option, index) => (
                    <div
                      key={index}
                      className={`flex flex-row justify-between p-2 border-[1px] border-erniegreen rounded-lg ${
                        selectedPayment == index && "bg-erniedarkcream"
                      }`}
                      onClick={() => {
                        setSelectedPayment(index);
                      }}
                    >
                      <img className="h-6" src={option.image} />
                      <p className="font-circular text-erniegreen">{">"}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-erniecream rounded-xl p-6 flex flex-col">
                <p className="font-circe text-xl text-erniegreen font-[900] uppercase">
                  Order Summary
                </p>
                <img src="/divider.png" className=" w-full mt-2"></img>
                <div className="flex flex-col gap-1 mt-4">
                  {subBasket.map((item, index) => (
                    <div
                      className="w-full grid grid-cols-4 items-center"
                      key={index}
                    >
                      <p className="font-circular text-erniegreen col-span-2 text-sm">
                        {item.product.name}
                      </p>
                      <p className="font-circular text-erniegreen text-sm">
                        £
                        {(
                          parseFloat(item.product.price.replace("£", "")) *
                          item.quantity
                        ).toFixed(2)}
                      </p>
                      <div className="flex flex-row gap-2 items-center justify-end">
                        <p className="font-circular text-erniegreen text-right">
                          {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                  {oneOffBasket.map((item, index) => (
                    <div
                      className="w-full grid grid-cols-4 items-center"
                      key={index}
                    >
                      <p className="font-circular text-erniegreen col-span-2 text-sm">
                        {item.product.name}
                      </p>
                      <p className="font-circular text-erniegreen text-sm">
                        £
                        {(
                          parseFloat(item.product.price.replace("£", "")) *
                          item.quantity
                        ).toFixed(2)}
                      </p>
                      <div className="flex flex-row gap-2 items-center justify-end">
                        <p className="font-circular text-erniegreen text-right">
                          {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-erniegold rounded-xl w-full p-2">
                <p className="font-circe font-[900] text-erniegreen text-center text-lg">
                  Pay Now
                </p>
              </div>
            </div>
          ) : (
            <div className="absolute right-0 top-20 h-auto w-full bg-erniedarkcream px-6 z-[999] py-6 flex flex-col gap-4">
              {((subBasket == null && oneOffBasket == null) ||
                (subBasket?.length == 0 && oneOffBasket?.length == 0)) && (
                <p className="font-circular text-erniegreen text-center">
                  You&apos;re basket is currently empty
                </p>
              )}
              <div className="bg-erniecream rounded-xl p-6 flex flex-col">
                <p className="font-circe text-xl text-erniegreen font-[900] uppercase">
                  My Subscription Basket
                </p>
                <img src="/divider.png" className=" w-full mt-2"></img>
                <div className="flex flex-col gap-1 mt-4">
                  {subBasket.map((item, index) => (
                    <div
                      className="w-full grid grid-cols-4 items-center"
                      key={index}
                    >
                      <p className="font-circular text-erniegreen col-span-2 text-sm">
                        {item.product.name}
                      </p>
                      <p className="font-circular text-erniegreen text-sm">
                        £
                        {(
                          parseFloat(item.product.price.replace("£", "")) *
                          item.quantity
                        ).toFixed(2)}
                      </p>
                      <div className="flex flex-row gap-2 items-center justify-end">
                        <div
                          className="flex flex-col justify-center items-center border-[1px] border-erniegreen rounded-full aspect-[1/1] p-1 min-w-[22px] max-h-[20px] cursor-pointer"
                          onClick={() => decSubQuantity(index)}
                        >
                          <img
                            src="/remove-green.svg"
                            className="w-3 h-3"
                          ></img>
                        </div>
                        <p className="font-circular text-erniegreen text-right">
                          {item.quantity}
                        </p>
                        <div
                          className="flex flex-col justify-center items-center border-[1px] border-erniegreen rounded-full aspect-[1/1] p-1 min-w-[22px] max-h-[20px] cursor-pointer"
                          onClick={() => incSubQuantity(index)}
                        >
                          <img src="/add-green.svg" className="w-3 h-3"></img>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-erniecream rounded-xl p-6 flex flex-col">
                <p className="font-circe text-xl text-erniegreen font-[900] uppercase">
                  Subscription Frequency
                </p>
                <img src="/divider.png" className=" w-full mt-2"></img>
                <select
                  name="frequency"
                  onChange={(e) => {
                    setNewSubFrequency(e.target.value.toUpperCase());
                  }}
                  className="mt-4 border-[1px] border-erniegreen bg-erniecream rounded-lg font-circular px-2 py-2 text-erniegreen text-sm font-[500]"
                >
                  <option value="weekly" selected={true}>
                    Weekly
                  </option>
                  <option value="bi-weekly">
                    {"Bi-weekly (once every two weeks)"}
                  </option>
                  <option value="monthly">Monthly</option>
                  <option value="bi-monthly">
                    {"Bi-monthly (once every two months)"}
                  </option>
                </select>
              </div>
              <div className="bg-erniecream rounded-xl p-6 flex flex-col">
                <p className="font-circe text-xl text-erniegreen font-[900] uppercase">
                  My One Off Basket
                </p>
                <img src="/divider.png" className=" w-full mt-2"></img>
                <div className="flex flex-col mt-4 gap-1">
                  {oneOffBasket.map((item, index) => (
                    <div
                      className="w-full grid grid-cols-4 items-center"
                      key={index}
                    >
                      <p className="font-circular text-erniegreen col-span-2 text-sm">
                        {item.product.name}
                      </p>
                      <p className="font-circular text-erniegreen text-sm">
                        £
                        {(
                          parseFloat(item.product.price.replace("£", "")) *
                          item.quantity
                        ).toFixed(2)}
                      </p>
                      <div className="flex flex-row gap-2 items-center justify-end">
                        <div
                          className="flex flex-col justify-center items-center border-[1px] border-erniegreen rounded-full aspect-[1/1] p-1 min-w-[22px] max-h-[20px] cursor-pointer"
                          onClick={() => decOneOffQuantity(index)}
                        >
                          <img
                            src="/remove-green.svg"
                            className="w-3 h-3"
                          ></img>
                        </div>
                        <p className="font-circular text-erniegreen text-right">
                          {item.quantity}
                        </p>
                        <div
                          className="flex flex-col justify-center items-center border-[1px] border-erniegreen rounded-full aspect-[1/1] p-1 min-w-[22px] max-h-[20px] cursor-pointer"
                          onClick={() => incOneOffQuantity(index)}
                        >
                          <img src="/add-green.svg" className="w-3 h-3"></img>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-erniecream rounded-xl p-6 flex flex-col">
                <p className="font-circular font-[900] text-erniegreen">
                  Subtotal
                </p>
                <div className="flex flex-row justify-between mt-2">
                  <p className="font-circular text-erniegreen text-sm">
                    Subscription items
                  </p>

                  <p className="font-circular font-[900] text-erniegreen text-sm">
                    £{getSubSubtotal().toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-row justify-between">
                  <p className="font-circular text-erniegreen text-sm">
                    One off items
                  </p>
                  <p className="font-circular font-[900] text-erniegreen text-sm">
                    £{getOneOffSubtotal().toFixed(2)}
                  </p>
                </div>
                <div className="w-full h-[1px] bg-erniegreen mt-4"></div>
                <div className="flex flex-row justify-between mt-4">
                  <p className="font-circular font-[900] text-erniegreen">
                    Total
                  </p>
                  <p className="font-circular font-[900] text-erniegreen text-sm">
                    £{(getSubSubtotal() + getOneOffSubtotal()).toFixed(2)}
                  </p>
                </div>
              </div>
              <div
                className="bg-erniegold rounded-xl w-full p-2"
                onClick={() => {
                  setShowingCheckout(true);
                }}
              >
                <p className="font-circe font-[900] text-erniegreen text-center text-lg">
                  Checkout
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
