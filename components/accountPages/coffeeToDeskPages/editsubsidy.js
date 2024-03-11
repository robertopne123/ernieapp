import { useState } from "react";

export default function EditSubsidy({
  backAction,
  subsidy,
  subsidyType,
  usageLimit,
  saveChanges,
}) {
  const [subsidyTypeValue, setSubsidyTypeValue] = useState(
    subsidyType == "FIXED_CART" ? 0 : 1
  );

  const [subsidyValue, setSubsidyValue] = useState(parseFloat(subsidy + ""));

  const [usageLimitValue, setUsageLimitValue] = useState(usageLimit);

  const increaseSubsidyValue = () => {
    if (subsidyType == 0) {
      if (subsidyValue < 100.0) {
        setSubsidyValue(subsidyValue + 0.5);
      }
    } else {
      if (subsidyValue < 100.0) {
        setSubsidyValue(subsidyValue + 1);
      }
    }
  };

  const decreaseSubsidyValue = () => {
    if (subsidyType == 0) {
      if (subsidyValue > 0.0) {
        setSubsidyValue(subsidyValue - 0.5);
      }
    } else {
      if (subsidyValue > 0.0) {
        setSubsidyValue(subsidyValue - 1);
      }
    }
  };

  const increaseUsageLimit = () => {
    setUsageLimitValue(usageLimitValue + 1);
  };

  const decreaseUsageLimit = () => {
    setUsageLimitValue(usageLimitValue - 1);
  };

  const saveSettings = (val, type) => {
    saveChanges(val, type);
  };

  return (
    <div className="flex flex-col flex-grow px-4 py-10 gap-4">
      <div
        className="absolute top-0 left-0 p-6 bg-erniemint w-full"
        onClick={backAction}
      >
        <img src="/left-arrow.svg" className="w-6"></img>
      </div>
      <p className="uppercase font-circe font-[900] text-4xl text-erniegreen mt-16">
        Edit Subsidy
      </p>
      <div className="flex flex-col">
        <p className="font-circe text-erniegreen font-[900] uppercase text-2xl">
          Subsidy
        </p>
        <img src="/divider.png" className="h-1.5 w-full mt-2"></img>
        <div className="flex flex-col gap-2 mt-2">
          <p className="font-circular text-erniegreen font-[500]">
            Subsidy Type
          </p>
          <div className="flex flex-row relative">
            <select
              className="w-full outline-none bg-erniecream p-2 font-circular border-2 border-erniegreen appearance-none h-12"
              onChange={(e) => {
                setSubsidyTypeValue(e.target.value);
              }}
            >
              <option selected={subsidyTypeValue == 0} value={0}>
                Value-based Subsidy
              </option>
              <option selected={subsidyTypeValue == 1} value={1}>
                Percentage-based Subsidy
              </option>
            </select>
            <img
              src="/down.svg"
              className="w-4 absolute right-2 top-[18px] pointer-events-none"
            ></img>
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-2">
          <p className="font-circular text-erniegreen font-[500]">
            Subsidy Value
          </p>
          <div className="flex flex-row justify-start relative">
            <div
              className="aspect-square h-10 bg-erniegreen w-auto p-3 justify-center flex flex-col cursor-pointer select-none"
              onClick={(e) => decreaseSubsidyValue()}
            >
              <img src="/remove.svg" className="pointer-events-none"></img>
            </div>
            <input
              type="text"
              value={
                subsidyTypeValue == 0 ? "£" + subsidyValue : subsidyValue + "%"
              }
              onChange={(e) => setSubsidyValue(e.target.value)}
              className="w-full outline-none bg-erniecream p-2 font-circe font-[900] text-2xl appearance-none h-10 max-w-[100px] after:content-[''] text-center"
            ></input>
            <div
              className="aspect-square h-10 bg-erniegreen w-auto p-3 justify-center flex flex-col cursor-pointer select-none"
              onClick={(e) => increaseSubsidyValue()}
            >
              <img src="/add.svg" className="pointer-events-none"></img>
            </div>
          </div>
        </div>
        {/* <div className="flex flex-col gap-2 mt-2">
          <p className="font-circular text-erniegreen font-[500]">
            Usage Limits
          </p>
          <div className="flex flex-row gap-2">
            <label htmlFor="limit" className="font-circular font-[500]">
              Limit subsidy usage
            </label>
            <input
              name="limit"
              type="checkbox"
              className="appearance-none border-2 border-erniegreen w-6 h-6 checked:bg-[url('/checkbox.svg')] checked:bg-cover"
            ></input>
          </div>
          <div className="flex flex-row justify-start relative">
            <div
              className="aspect-square h-10 bg-erniegreen w-auto p-3 justify-center flex flex-col cursor-pointer select-none"
              onClick={(e) => decreaseUsageLimit()}
            >
              <img src="/remove.svg" className="pointer-events-none"></img>
            </div>
            <input
              type="text"
              value={usageLimitValue}
              className="w-full outline-none bg-erniecream p-2 font-circe font-[900] text-2xl appearance-none h-10 max-w-[100px] after:content-[''] text-center"
            ></input>
            <div
              className="aspect-square h-10 bg-erniegreen w-auto p-3 justify-center flex flex-col cursor-pointer select-none"
              onClick={(e) => increaseUsageLimit()}
            >
              <img src="/add.svg" className="pointer-events-none"></img>
            </div>
          </div>
        </div> */}
        <div
          className="flex flex-col justify-center pt-4 pb-3 bg-erniegreen mt-4"
          onClick={(e) => {
            saveSettings(
              subsidyValue,
              subsidyTypeValue == 0 ? "FIXED_CART" : "PERCENT"
            );
          }}
        >
          <p className="font-circe font-[900] text-erniecream uppercase text-center text-xl">
            Save
          </p>
        </div>
      </div>
    </div>
  );
}
