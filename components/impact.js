import Image from "next/image";
import ErnieImpact from "./homeComponents/ernieimpact";
import { useState } from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { fullScreenPlugin } from "@react-pdf-viewer/full-screen";
import "@react-pdf-viewer/full-screen/lib/styles/index.css";
import { scrollModePlugin } from "@react-pdf-viewer/scroll-mode";
import { ScrollMode } from "@react-pdf-viewer/core";
import {
  RenderCurrentScaleProps,
  RenderZoomInProps,
  RenderZoomOutProps,
  zoomPlugin,
} from "@react-pdf-viewer/zoom";
import "@react-pdf-viewer/zoom/lib/styles/index.css";
import { SpecialZoomLevel } from "@react-pdf-viewer/core";

export default function Impact({
  quantity,
  userQuantity,
  userTotalQuantity,
  defaultTab,
  role,
  impactCertificateURL,
}) {
  const [impactTab, setImpactTab] = useState(defaultTab);

  const backAction = () => {
    setShowingCert(false);
  };

  let tabs = [];

  if (role == 0) {
    tabs = [{ name: "My Impact" }, { name: "Ernie's Impact" }];
  } else {
    tabs = [{ name: "Our Impact" }, { name: "Ernie's Impact" }];
  }

  const [showingCert, setShowingCert] = useState(false);

  const [client, setClient] = useState(
    JSON.parse(localStorage.getItem("client"))
  );

  const PdfViewer = ({ url }) => {
    const fullScreenPluginInstance = fullScreenPlugin();
    const scrollModePluginInstance = scrollModePlugin();
    const zoomPluginInstance = zoomPlugin();

    // Switch to the wrapped mode
    scrollModePluginInstance.SwitchScrollMode(ScrollMode.Wrapped);
    const { CurrentScale, ZoomIn, ZoomOut } = zoomPluginInstance;

    return (
      <div className="h-[calc(100%-37px)] w-full bg-erniedarkcream flex flex-col gap-6 justify-between relative">
        <div className="max-h-pdfinner flex-grow px-6 rounded-xl overflow-hidden">
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <Viewer
              fileUrl={url}
              plugins={[
                fullScreenPluginInstance,
                scrollModePluginInstance,
                zoomPluginInstance,
              ]}
              defaultScale={SpecialZoomLevel.PageWidth}
              className="w-full"
            />
          </Worker>
        </div>
        <div className="flex flex-row mx-6 mb-6 rounded-lg bottom-0 left-0 justify-center bg-erniecream p-6 gap-4">
          {/* <div className="w-full flex flex-row gap-6">
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
            </div> */}
          <ZoomOut>
            {(props) => (
              <button
                className="bg-erniedarkcream p-1 rounded-xl flex-grow font-circular text-center text-erniegreen text-xl"
                onClick={props.onClick}
              >
                -
              </button>
            )}
          </ZoomOut>
          <CurrentScale>
            {(props) => (
              <div className="flex flex-col justify-center">
                <p className="font-circe font-erniegreen font-[900] self-center w-10 text-center">{`${Math.round(
                  props.scale * 100
                )}%`}</p>
              </div>
            )}
          </CurrentScale>
          <ZoomIn>
            {(props) => (
              <button
                className="bg-erniedarkcream p-1 rounded-lg flex-grow font-circular text-center text-erniegreen text-xl"
                onClick={props.onClick}
              >
                +
              </button>
            )}
          </ZoomIn>
          <a
            href={impactCertificateURL}
            download
            className="py-2 px-3 rounded-lg flex flex-col justify-center bg-erniegold w-auto self-start font-circular text-center text-sm text-erniegreen text-[600]"
          >
            Download
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="h-[calc(88vh-80px)] bg-erniecream overflow-hidden">
      {!showingCert ? (
        <div className="flex flex-col h-full">
          <div className="flex flex-col gap-4 bg-erniedarkcream p-6">
            <div className="flex flex-row gap-2 bg-erniedarkcream">
              {tabs.map((tab, index) => (
                <div
                  key={index}
                  className={`py-2 px-3 rounded-lg flex flex-col justify-center ${
                    impactTab == index ? "bg-ernieteal" : "bg-erniecream"
                  }`}
                  onClick={(e) => {
                    setImpactTab(index);
                  }}
                >
                  <p
                    className={`font-circular  text-center text-sm ${
                      impactTab == index ? "text-erniecream" : "text-erniegreen"
                    }`}
                  >
                    {tab.name}
                  </p>
                </div>
              ))}
            </div>
            {impactTab == 0 && (
              <div
                className="py-2 px-3 rounded-lg flex flex-col justify-center bg-erniegold w-auto self-start"
                onClick={(e) => setShowingCert(true)}
              >
                <p className="font-circular text-center text-sm text-erniegreen text-[600]">
                  See Impact Certificate
                </p>
              </div>
            )}
          </div>
          <div className="bg-erniemint flex flex-col overflow-hidden h-[calc(100%-36px)] pb-[84px]">
            {impactTab == 0 && (
              <div className="flex flex-col gap-6 px-6 pt-6 pb-6 overflow-auto flex-grow h-[calc(100%-36px)]">
                <div className="flex flex-col">
                  <p className="font-circe text-xl text-erniegreen font-[900] uppercase">
                    My Impact
                  </p>
                  <img src="/divider.png" className=" w-full mt-2"></img>
                </div>
                <div className="flex flex-row gap-2">
                  <Image
                    src="https://ernie.london/wp-content/uploads/2023/07/WASTE-COFFEE-BAG_COLOURED.gif"
                    width={112}
                    height={112}
                    priority
                    className="w-28 h-28"
                  ></Image>
                  {console.log(client)}
                  <div className="flex flex-col justify-center pr-1">
                    <p className="font-circe uppercase text-erniegreen text-4xl font-[900]">
                      {client.impactFigures.bags}
                    </p>
                    <p className="font-circular font-[500] text-erniegreen">
                      Bags directed from waste stream
                    </p>
                  </div>
                </div>
                <div className="flex flex-row gap-2">
                  <Image
                    src="https://ernie.london/wp-content/uploads/2023/07/HUGGING-WORLD_COLOURED.gif"
                    width={112}
                    height={112}
                    priority
                    className="w-28 h-28"
                  ></Image>
                  <div className="flex flex-col justify-center pr-1">
                    <p className="font-circe uppercase text-erniegreen text-4xl font-[900]">
                      {client.impactFigures.carbon}
                    </p>
                    <p className="font-circular font-[500] text-erniegreen">
                      Kgs of carbon removed from the atmosphere
                    </p>
                  </div>
                </div>
                <div className="flex flex-row gap-2">
                  <Image
                    src="https://ernie.london/wp-content/uploads/2023/07/TREE-GROWING_COLOURED.gif"
                    width={112}
                    height={112}
                    priority
                    className="w-28 h-28"
                  ></Image>
                  <div className="flex flex-col justify-center pr-1">
                    <p className="font-circe uppercase text-erniegreen text-4xl font-[900]">
                      {client.impactFigures.trees}
                    </p>
                    <p className="font-circular font-[500] text-erniegreen">
                      Trees planted
                    </p>
                  </div>
                </div>
                <div className="flex flex-row gap-2">
                  <Image
                    src="https://ernie.london/wp-content/uploads/2023/07/HUGGING-COFFEE_COLOURED.gif"
                    width={112}
                    height={112}
                    priority
                    className="w-28 h-28"
                  ></Image>
                  <div className="flex flex-col justify-center pr-1">
                    <p className="font-circe uppercase text-erniegreen text-4xl font-[900]">
                      {client.impactFigures.coffee}
                    </p>
                    <p className="font-circular font-[500] text-erniegreen">
                      Cups of coffee enjoyed by you
                    </p>
                  </div>
                </div>
                <div className="flex flex-row gap-2">
                  <Image
                    src="https://ernie.london/wp-content/uploads/2023/07/PHONE-CHARGE_COLOURED.gif"
                    width={112}
                    height={112}
                    priority
                    className="w-28 h-28"
                  ></Image>
                  <div className="flex flex-col justify-center pr-1">
                    <p className="font-circe uppercase text-erniegreen text-4xl font-[900]">
                      {client.impactFigures.phones}
                    </p>
                    <p className="font-circular font-[500] text-erniegreen">
                      Phones charged from Tco2e saved
                    </p>
                  </div>
                </div>
                <div className="flex flex-row gap-2">
                  <Image
                    src="https://ernie.london/wp-content/uploads/2023/07/CAR_COLOURED.gif"
                    width={112}
                    height={112}
                    priority
                    className="w-28 h-28"
                  ></Image>
                  <div className="flex flex-col justify-center pr-1">
                    <p className="font-circe uppercase text-erniegreen text-4xl font-[900]">
                      {client.impactFigures.m25}
                    </p>
                    <p className="font-circular font-[500] text-erniegreen">
                      Loops of the M25 worth of carbon saved
                    </p>
                  </div>
                </div>
                {/* <div className="flex flex-row justify-center absolute bg-erniedarkcream w-full left-0 bottom-[108px] py-4 px-6">
                  <div
                    className="bg-erniegold w-full px-4 py-2 flex flex-col justify-center items-center rounded-xl"
                    onClick={(e) => setShowingCert(true)}
                  >
                    <p className="text-erniegreen font-circe font-[900] text-lg">
                      See Impact Certificate
                    </p>
                  </div>
                </div> */}
              </div>
            )}
            {impactTab == 1 && <ErnieImpact quantity={quantity} role={role} />}
          </div>
        </div>
      ) : (
        <div className="h-full w-full relative flex flex-col gap-6 bg-erniedarkcream">
          <div
            className="py-2 mx-6 flex flex-row items-center gap-1 border-b-[1px] border-erniegreen cursor-pointer"
            onClick={backAction}
          >
            <div className="h-3 w-3 relative">
              <Image src="/left-arrow.svg" fill={true} className="h-6"></Image>
            </div>
            <p className="font-circular font-[500] text-center text-sm text-erniegreen">
              Back
            </p>
          </div>
          <PdfViewer url={impactCertificateURL}></PdfViewer>
        </div>
      )}
    </div>
  );
}
