import Image from "next/image";
import ErnieImpact from "./summarySections/ernieimpact";
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

  const PdfViewer = ({ url }) => {
    const fullScreenPluginInstance = fullScreenPlugin();
    const scrollModePluginInstance = scrollModePlugin();
    const zoomPluginInstance = zoomPlugin();

    // Switch to the wrapped mode
    scrollModePluginInstance.SwitchScrollMode(ScrollMode.Wrapped);
    const { CurrentScale, ZoomIn, ZoomOut } = zoomPluginInstance;

    return (
      <div className="h-full w-full bg-ernieteal flex flex-col">
        <div className="max-h-pdfinner flex-grow">
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
        <div className="flex flex-row w-full bottom-0 left-0 justify-center bg-erniegreen p-2 gap-4">
          <ZoomOut>
            {(props) => (
              <button
                className="bg-erniegold border-none rounded-none text-erniegreen cursor-pointer py-2 px-4 font-circular font-[500]"
                onClick={props.onClick}
              >
                Zoom out
              </button>
            )}
          </ZoomOut>
          <CurrentScale>
            {(props) => (
              <div className="flex flex-col justify-center">
                <p className="text-erniecream font-circe font-[900] text-lg">{`${Math.round(
                  props.scale * 100
                )}%`}</p>
              </div>
            )}
          </CurrentScale>
          <ZoomIn>
            {(props) => (
              <button
                className="bg-erniegold border-none rounded-none text-erniegreen cursor-pointer py-2 px-4 font-circular font-[500]"
                onClick={props.onClick}
              >
                Zoom in
              </button>
            )}
          </ZoomIn>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full bg-erniecream overflow-hidden">
      {!showingCert ? (
        <div className="flex flex-col h-full">
          <div className="flex flex-row gap-0 px-2 mt-2">
            {tabs.map((tab, index) => (
              <div
                key={index}
                className={`h-[8vh] w-full rounded-t-xl flex flex-col justify-center ${
                  impactTab == index ? "bg-erniemint" : "bg-ernieteal"
                }`}
                onClick={(e) => {
                  setImpactTab(index);
                }}
              >
                <p
                  className={`font-circe uppercase font-[900] text-base smmb:text-lg lgmb:text-xl text-center ${
                    impactTab == index ? "text-erniegreen" : "text-erniecream"
                  }`}
                >
                  {tab.name}
                </p>
              </div>
            ))}
          </div>
          <div className="bg-erniemint flex flex-col overflow-hidden">
            {impactTab == 0 && (
              <div className="flex flex-col gap-6 px-4 py-12 overflow-auto flex-grow">
                <p className="uppercase font-circe font-[900] text-center text-4xl text-erniegreen">
                  {role == 0 ? "My Impact" : "Our Impact"}
                </p>
                <div className="flex flex-row gap-2">
                  <Image
                    src="https://ernie.london/wp-content/uploads/2023/07/WASTE-COFFEE-BAG_COLOURED.gif"
                    width={112}
                    height={112}
                    priority
                    className="w-28 h-28"
                  ></Image>
                  <div className="flex flex-col justify-center pr-1">
                    <p className="font-circe uppercase text-erniegreen text-4xl font-[900]">
                      {userTotalQuantity}
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
                      {userTotalQuantity * 0.44 +
                        Math.floor(userTotalQuantity / 2) * 25}
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
                      {Math.floor(userTotalQuantity / 6)}
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
                      {userTotalQuantity * 100}
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
                      {Math.round(userTotalQuantity * 0.44 * 120)}
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
                      {Math.round((userTotalQuantity * 0.44) / 32.148) < 1
                        ? Math.round(
                            ((userTotalQuantity * 0.44) / 32.148) * 100
                          ) / 100
                        : Math.round((userTotalQuantity * 0.44) / 32.148)}
                    </p>
                    <p className="font-circular font-[500] text-erniegreen">
                      Loops of the M25 worth of carbon saved
                    </p>
                  </div>
                </div>
                <div className="flex flex-row justify-center px-4">
                  <div
                    className="bg-erniegreen px-4 py-2 flex flex-col justify-center items-center"
                    onClick={(e) => setShowingCert(true)}
                  >
                    <p className="text-erniecream font-circe font-[900] uppercase text-lg">
                      See Impact Certificate
                    </p>
                  </div>
                </div>
              </div>
            )}
            {impactTab == 1 && <ErnieImpact quantity={quantity} role={role} />}
          </div>
        </div>
      ) : (
        <div className="h-full w-full relative pt-[72px]">
          <div className="absolute top-0 left-0 p-6 bg-erniemint w-full flex flex-row justify-between">
            <img
              src="/left-arrow.svg"
              className="w-6"
              onClick={backAction}
            ></img>
            <a href={impactCertificateURL} download>
              <img src="/download.svg" className="w-6"></img>
            </a>
          </div>
          <PdfViewer url={impactCertificateURL}></PdfViewer>
        </div>
      )}
    </div>
  );
}
