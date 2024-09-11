import { useState } from "react";

export const Info = ({ close, name, description }) => {
  const [loading, setLoading] = useState(false);

  return (
    <div className="fixed top-0 left-0 bg-erniegreen h-screen w-full z-[999] bg-opacity-70 p-6 flex flex-col justify-center">
      <div className="p-6 bg-erniemint w-full rounded-lg flex flex-col items-end gap-4">
        <img
          src="/cross.svg"
          className="w-3 align cursor-pointer"
          onClick={() => {
            close();
          }}
        ></img>
        <div className="bg-erniecream w-full rounded-lg flex flex-col">
          <div className="p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <p className="font-circe font-[900] text-lg text-erniegreen uppercase">
                {name}
              </p>
              <img src="/divider.png" className="w-full"></img>
            </div>
            <p className="font-circular text-sm font-[500] text-erniegreen">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
