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
  showingCert,
  setShowingCert,
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
        <div className="max-h-pdfinner flex-grow px-6 lg:px-0 rounded-xl overflow-hidden">
          <Worker
            workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js"
            className="w-full h-full"
          >
            <Viewer
              fileUrl={url}
              plugins={[
                fullScreenPluginInstance,
                scrollModePluginInstance,
                zoomPluginInstance,
              ]}
              defaultScale={SpecialZoomLevel.PageWidth}
              className="w-full h-full"
            />
          </Worker>
        </div>
        <div className="flex flex-row lg:grid lg:grid-cols-3 mx-6 lg:mx-0 mb-6 rounded-lg bottom-0 left-0 justify-center bg-erniecream p-6 gap-4">
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
                <p className="font-circe font-erniegreen font-[900] self-center w-10 text-center lg:text-xl">{`${Math.round(
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
            className="py-2 px-3 xl:py-4 xl:px-6 rounded-lg flex flex-col justify-center bg-erniegold w-auto self-start font-circular text-center text-sm xl:text-base text-erniegreen text-[600] lg:col-span-3"
          >
            Download
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="h-[calc(88vh-180px)] lg:h-full bg-erniecream overflow-auto">
      {!showingCert ? (
        <div className="flex flex-col h-full">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-2 bg-erniedarkcream p-6 lg:p-10">
            <div className="flex flex-row gap-2 bg-erniedarkcream">
              {tabs.map((tab, index) => (
                <div
                  key={index}
                  className={`py-2 px-3 rounded-lg flex flex-col justify-center cursor-pointer ${
                    impactTab == index ? "bg-ernieteal" : "bg-erniecream"
                  }`}
                  onClick={(e) => {
                    setImpactTab(index);
                  }}
                >
                  <p
                    className={`font-circular  text-center text-sm lg:text-base ${
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
                className="py-2 px-3 rounded-lg flex flex-col justify-center bg-erniegold w-auto self-start cursor-pointer flex lg:hidden"
                onClick={(e) => setShowingCert(true)}
              >
                <p className="font-circular text-center text-sm lg:text-base text-erniegreen text-[600]">
                  See Impact Certificate
                </p>
              </div>
            )}
          </div>
          <div className="bg-erniemint flex flex-col overflow-hidden h-[calc(100%-36px)]">
            {impactTab == 0 && (
              <div className="flex flex-row h-full">
                <div className="flex flex-col gap-6 lg:gap-8 p-6 lg:p-12 overflow-auto flex-grow h-[calc(100%-36px)]">
                  <div className="flex flex-col">
                    <p className="font-circe text-xl text-erniegreen font-[900] uppercase lg:text-4xl lg:text-center">
                      My Impact
                    </p>
                    <img
                      src="/divider.png"
                      className=" w-full mt-2 lg:hidden"
                    ></img>
                  </div>
                  <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:gap-6 xl:gap-14 md:gap-6">
                    <div className="flex flex-row gap-2 lg:gap-4">
                      <Image
                        src="https://ernie.london/wp-content/uploads/2023/07/WASTE-COFFEE-BAG_COLOURED.gif"
                        width={112}
                        height={112}
                        priority
                        className="w-28 h-28 xl:w-32 xl:h-32 lg:w-24 lg:h-24"
                      ></Image>
                      {console.log(client)}
                      <div className="flex flex-col justify-center pr-1">
                        <p className="font-circe uppercase text-erniegreen text-4xl md:text-3xl font-[900]">
                          {client.impactFigures.bags != null
                            ? client.impactFigures.bags
                            : 0}
                        </p>
                        <p className="font-circular font-[500] text-erniegreen md:text-sm">
                          Bags directed from waste stream
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-row gap-2 lg:gap-4">
                      <Image
                        src="https://ernie.london/wp-content/uploads/2023/07/HUGGING-WORLD_COLOURED.gif"
                        width={112}
                        height={112}
                        priority
                        className="w-28 h-28 xl:w-32 xl:h-32 lg:w-24 lg:h-24"
                      ></Image>
                      <div className="flex flex-col justify-center pr-1">
                        <p className="font-circe uppercase text-erniegreen text-4xl md:text-3xl font-[900]">
                          {client.impactFigures.carbon != null
                            ? client.impactFigures.carbon
                            : 0}
                        </p>
                        <p className="font-circular font-[500] text-erniegreen md:text-sm">
                          Kgs of carbon removed from the atmosphere
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-row gap-2 lg:gap-4">
                      <Image
                        src="https://ernie.london/wp-content/uploads/2023/07/TREE-GROWING_COLOURED.gif"
                        width={112}
                        height={112}
                        priority
                        className="w-28 h-28 xl:w-32 xl:h-32 lg:w-24 lg:h-24"
                      ></Image>
                      <div className="flex flex-col justify-center pr-1">
                        <p className="font-circe uppercase text-erniegreen text-4xl md:text-3xl font-[900]">
                          £
                          {client.impactFigures.trees != null
                            ? parseFloat(client.impactFigures.trees)
                            : 0.0}
                        </p>
                        <p className="font-circular font-[500] text-erniegreen md:text-sm">
                          Trees planted
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-row gap-2 lg:gap-4">
                      <Image
                        src="https://ernie.london/wp-content/uploads/2023/07/HUGGING-COFFEE_COLOURED.gif"
                        width={112}
                        height={112}
                        priority
                        className="w-28 h-28 xl:w-32 xl:h-32 lg:w-24 lg:h-24"
                      ></Image>
                      <div className="flex flex-col justify-center pr-1">
                        <p className="font-circe uppercase text-erniegreen text-4xl md:text-3xl font-[900]">
                          {client.impactFigures.coffee != null
                            ? client.impactFigures.coffee
                            : 0}
                        </p>
                        <p className="font-circular font-[500] text-erniegreen md:text-sm">
                          Cups of coffee enjoyed by you
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-row gap-2 lg:gap-4">
                      <Image
                        src="https://ernie.london/wp-content/uploads/2023/07/PHONE-CHARGE_COLOURED.gif"
                        width={112}
                        height={112}
                        priority
                        className="w-28 h-28 xl:w-32 xl:h-32 lg:w-24 lg:h-24"
                      ></Image>
                      <div className="flex flex-col justify-center pr-1">
                        <p className="font-circe uppercase text-erniegreen text-4xl md:text-3xl font-[900]">
                          {client.impactFigures.phones != null
                            ? client.impactFigures.phones
                            : 0}
                        </p>
                        <p className="font-circular font-[500] text-erniegreen md:text-sm">
                          Phones charged from Tco2e saved
                        </p>
                      </div>
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
                <div className="h-full min-w-[40%] relative flex-col gap-6 p-10 bg-erniedarkcream hidden lg:flex">
                  <p className="font-circe text-xl text-erniegreen font-[900] uppercase lg:text-2xl">
                    My Impact Certificate
                  </p>
                  <PdfViewer url={impactCertificateURL}></PdfViewer>
                </div>
              </div>
            )}
            {impactTab == 1 && <ErnieImpact quantity={quantity} role={role} />}
          </div>
        </div>
      ) : (
        <div className="h-full w-full relative flex flex-col gap-6 lg:gap-10 bg-erniedarkcream">
          <div
            className="py-2 lg:pt-10 mx-6 lg:mx-10 flex flex-row items-center gap-1 border-b-[1px] border-erniegreen cursor-pointer"
            onClick={backAction}
          >
            <div className="h-3 w-3 lg:w-4 lg:h-4 relative">
              <Image src="/left-arrow.svg" fill={true} className="h-6"></Image>
            </div>
            <p className="font-circular font-[500] text-center text-sm text-erniegreen lg:text-lg">
              Back
            </p>
          </div>
          <PdfViewer url={impactCertificateURL}></PdfViewer>
        </div>
      )}
    </div>
  );
}
