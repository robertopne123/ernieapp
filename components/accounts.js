import { useState } from "react";
import MyOrders from "./accountPages/myorders";
import OrderHistory from "./accountPages/orderhistory";
import Image from "next/image";
import CoffeeToDesk from "./accountPages/coffeetodesk";
import About from "./accountPages/about";
import { AccountDetails } from "./accountPages/accountDetails";
import { DeliveryAndReturns } from "./accountPages/deliveryAndReturns";

export default function Accounts({
  userQuantity,
  orders,
  subsidy,
  subsidyType,
  usageLimit,
  employees,
  nextDelivery,
  saveChanges,
  subsidyChanging,
  role,
  cfh,
  gs,
}) {
  const [selectedPage, setSelectedPage] = useState(-1);

  const back = () => setSelectedPage(-1);

  const saveChangesFromCTDPage = (val, type) => {
    saveChanges(val, type);
  };

  return (
    <div className={`w-full h-full bg-erniemint lg:pb-0`}>
      {selectedPage == -1 && (
        <div
          className={`grid ${
            cfh ? "grid-rows-2" : "grid-rows-4"
          } lg:grid-cols-2 lg:grid-rows-2 lg:h-full gap-4 lg:gap-10 p-6 lg:p-10 bg-erniemint overflow-auto cursor-pointer ${
            role == 0 ? "h-full" : "h-1/2"
          } w-full`}
        >
          {!cfh && (
            <div
              className="bg-erniecream rounded-xl p-6 lg:p-10 flex flex-row gap-4 items-center"
              onClick={() => {
                setSelectedPage(4);
              }}
            >
              <Image
                width={100}
                height={100}
                src="/PENCIL TICKING_COLOURED.png"
                className="w-24 h-24 lg:w-32 lg:h-32 object-contain"
                priority
              ></Image>
              <p className="font-circe font-[900] text-erniegreen uppercase mdmb:text-2xl text-xl">
                Account
                <br className="xlmb:hidden" /> Details
              </p>
            </div>
          )}
          {!cfh && (
            <div
              className="bg-erniecream rounded-xl p-6 lg:p-10 flex flex-row gap-4 items-center"
              onClick={() => {
                setSelectedPage(1);
              }}
            >
              <Image
                width={100}
                height={100}
                src="/orderhistory.png"
                className="w-24 h-24 lg:w-32 lg:h-32 object-contain"
                priority
              ></Image>
              <p className="font-circe font-[900] text-erniegreen uppercase mdmb:text-2xl text-xl">
                Order
                <br className="xlmb:hidden" /> Summary
              </p>
            </div>
          )}
          <div
            className="bg-erniecream rounded-xl p-6 lg:p-10 flex flex-row gap-4 items-center"
            onClick={() => {
              setSelectedPage(5);
            }}
          >
            <Image
              width={100}
              height={100}
              src="/BIKE_COLOURED.png"
              className="w-24 h-24 lg:w-32 lg:h-32 object-contain -translate-y-[10px]"
              priority
            ></Image>
            <p className="font-circe font-[900] text-erniegreen uppercase mdmb:text-2xl text-xl">
              Our
              <br className="xlmb:hidden" /> Policies
            </p>
          </div>
          <div
            className="bg-erniecream rounded-xl p-6 lg:p-10 flex flex-row gap-4 items-center"
            onClick={() => {
              setSelectedPage(3);
            }}
          >
            <Image
              width={100}
              height={100}
              src="/aboutapp.png"
              className="w-24 h-24 lg:w-32 lg:h-32 object-contain"
              priority
            ></Image>
            <p className="font-circe font-[900] text-erniegreen uppercase mdmb:text-2xl text-xl">
              About
              <br className="xlmb:hidden" /> The App
            </p>
          </div>
        </div>
      )}
      {selectedPage == 0 && (
        <MyOrders
          userQuantity={userQuantity}
          nextDelivery={nextDelivery}
          backAction={back}
        />
      )}
      {selectedPage == 1 && (
        <OrderHistory
          userQuantity={userQuantity}
          orders={orders}
          backAction={back}
        />
      )}
      {selectedPage == 2 && (
        <CoffeeToDesk
          backAction={back}
          subsidy={subsidy}
          subsidyType={subsidyType}
          usageLimit={usageLimit}
          employees={employees}
          saveChanges={saveChangesFromCTDPage}
          subsidyChanging={subsidyChanging}
        />
      )}
      {selectedPage == 4 && <AccountDetails backAction={back} />}
      {selectedPage == 5 && <DeliveryAndReturns backAction={back} />}
      {selectedPage == 3 && <About backAction={back} />}
    </div>
  );
}
