import { useState } from "react";
import EditSubsidy from "./coffeeToDeskPages/editsubsidy";
import EditEmployees from "./coffeeToDeskPages/editemployees";
import Image from "next/image";

export default function CoffeeToDesk({
  backAction,
  subsidy,
  subsidyType,
  usageLimit,
  employees,
  saveChanges,
  subsidyChanging,
}) {
  const [ctdTab, setCTDTab] = useState(-1);

  const back = () => {
    setCTDTab(-1);
  };

  const saveChangesFromEditSubsidyPage = (val, type) => {
    saveChanges(val, type);
    setCTDTab(-1);
  };

  return (
    <div className="h-full bg-erniecream">
      {ctdTab == -1 && (
        <div className="flex flex-col flex-grow pt-12 gap-4 h-full">
          <div
            className="absolute top-0 left-0 p-6 bg-erniemint w-full"
            onClick={backAction}
          >
            <img src="/left-arrow.svg" className="w-6"></img>
          </div>
          <div className="flex flex-col gap-4 px-4 pt-8">
            <div className="flex flex-col gap-4">
              <p className="uppercase font-circe font-[900] text-4xl text-erniegreen mt-6">
                Coffee To Desk
              </p>
              {/* <img src="/divider.png" className="h-1.5 w-full"></img> */}
              <div className="flex flex-col gap-0">
                <p className="font-circe text-2xl text-erniegreen font-[900] uppercase mt-2">
                  Subsidies
                </p>
                <img src="/divider.png" className="h-1.5 w-full mt-2"></img>
                <div className="grid grid-cols-2 mt-2">
                  <div className="flex flex-col gap-2">
                    <p className="font-circular text-erniegreen font-[500]">
                      Subsidy
                    </p>
                    <p
                      className={`font-circe text-erniegreen font-[900] ${
                        subsidyChanging ? "text-2xl" : "text-4xl"
                      }`}
                    >
                      {subsidyChanging
                        ? "UPDATING..."
                        : subsidyType == "FIXED_CART"
                        ? "£" + subsidy.amount
                        : subsidy.amount + "%"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="font-circular text-erniegreen font-[500]">
                      Subsidy Type
                    </p>
                    <p
                      className={`font-circe text-erniegreen font-[900] uppercase ${
                        subsidyChanging ? "text-2xl" : "text-3xl"
                      }`}
                    >
                      {subsidyChanging
                        ? "UPDATING..."
                        : subsidyType == "FIXED_CART"
                        ? "Value"
                        : "Percent"}
                    </p>
                  </div>
                </div>

                <p
                  className="font-circe text-erniegreen font-[900] uppercase text-xl hover:underline mt-2"
                  onClick={(e) => {
                    setCTDTab(0);
                  }}
                >
                  Edit Subsidy &#62;
                </p>
              </div>
              <div className="flex flex-col gap-0">
                <p className="font-circe text-2xl text-erniegreen font-[900] uppercase mt-2">
                  Employees
                </p>
                <img src="/divider.png" className="h-1.5 w-full mt-2"></img>
                <div className="grid grid-cols-2 mt-2">
                  <div className="flex flex-col gap-2">
                    <p className="font-circular text-erniegreen font-[500]">
                      Number of employees
                    </p>
                    <p className="font-circe text-erniegreen font-[900] text-4xl">
                      {employees?.length}
                    </p>
                  </div>
                </div>

                <p
                  className="font-circe text-erniegreen font-[900] uppercase text-xl hover:underline mt-2"
                  onClick={(e) => {
                    setCTDTab(1);
                  }}
                >
                  View Employees &#62;
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {ctdTab == 0 && (
        <EditSubsidy
          backAction={back}
          subsidy={subsidy}
          subsidyType={subsidyType}
          saveChanges={saveChangesFromEditSubsidyPage}
        />
      )}
      {ctdTab == 1 && <EditEmployees backAction={back} employees={employees} />}
    </div>
  );
}
