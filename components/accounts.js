import { useState } from "react";
import MyOrders from "./accountPages/myorders";
import OrderHistory from "./accountPages/orderhistory";
import Image from "next/image";
import CoffeeToDesk from "./accountPages/coffeetodesk";
import About from "./accountPages/about";

export default function Accounts({
  userQuantity,
  orders,
  subsidy,
  subsidyType,
  usageLimit,
  employees,
  nextDelivery,
  saveChanges,
}) {
  const [selectedPage, setSelectedPage] = useState(-1);

  const back = () => setSelectedPage(-1);

  const saveChangesFromCTDPage = (val, type) => {
    saveChanges(val, type);
  };

  return (
    <div className="w-full h-full">
      {selectedPage == -1 && (
        <div className="flex flex-col bg-erniemint h-full w-full">
          <div
            className="bg-erniemint w-full h-full flex flex-row items-center gap-4 px-8"
            onClick={(e) => {
              setSelectedPage(0);
            }}
          >
            <Image
              width={100}
              height={100}
              src="https://ernie.london/wp-content/uploads/2023/07/Asset-14@2x-3.png"
              className="w-24 h-24 object-contain"
              priority
            ></Image>
            <p className="font-circe font-[900] text-erniegreen uppercase text-2xl">
              My
              <br />
              Orders
            </p>
          </div>
          <div className="h-1.5 w-full relative">
            <Image
              fill={true}
              src="/divider.png"
              className="min-h-[6px] max-h-[6px] h-1.5 max-w-[calc(100%-32px)] mx-4"
              priority
            ></Image>
          </div>
          <div
            className="bg-erniemint w-full h-full flex flex-row items-center gap-4 px-8"
            onClick={(e) => {
              setSelectedPage(1);
            }}
          >
            <Image
              width={100}
              height={100}
              src="https://ernie.london/wp-content/uploads/2023/07/Asset-14@2x-3.png"
              className="w-24 h-24 object-contain"
              priority
            ></Image>
            <p className="font-circe font-[900] text-erniegreen uppercase text-2xl">
              Order History
            </p>
          </div>
          <div className="h-1.5 w-full relative">
            <Image
              fill={true}
              src="/divider.png"
              className="min-h-[6px] max-h-[6px] h-1.5 max-w-[calc(100%-32px)] mx-4"
              priority
            ></Image>
          </div>
          <div
            className="bg-erniemint w-full h-full flex flex-row items-center gap-4 px-8"
            onClick={(e) => {
              setSelectedPage(2);
            }}
          >
            <Image
              width={100}
              height={100}
              src="https://ernie.london/wp-content/uploads/2023/07/Asset-14@2x-3.png"
              className="w-24 h-24 object-contain"
              priority
            ></Image>
            <p className="font-circe font-[900] text-erniegreen uppercase text-2xl">
              Coffee To Desk
            </p>
          </div>
          <div className="h-1.5 w-full relative">
            <Image
              fill={true}
              src="/divider.png"
              className="min-h-[6px] max-h-[6px] h-1.5 max-w-[calc(100%-32px)] mx-4"
              priority
            ></Image>
          </div>
          <div
            className="bg-erniemint w-full h-full flex flex-row items-center gap-4 px-8"
            onClick={(e) => {
              setSelectedPage(3);
            }}
          >
            <Image
              width={100}
              height={100}
              src="https://ernie.london/wp-content/uploads/2023/07/Asset-14@2x-3.png"
              className="w-24 h-24 object-contain"
              priority
            ></Image>
            <p className="font-circe font-[900] text-erniegreen uppercase text-2xl">
              About <br />
              The App
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
        />
      )}
      {selectedPage == 3 && <About backAction={back} />}
    </div>
  );
}
