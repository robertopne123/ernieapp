import Image from "next/image";
import { useState } from "react";

export const Tutorial = ({ completeTutorial }) => {
  const [tutorialStage, setTutorialStage] = useState(0);

  const [animating, setAnimating] = useState(false);
  const [showingTerms, setShowingTerms] = useState(false);

  return (
    <div className="absolute top-0 z-[999] h-full w-full px-4 flex flex-col justify-center bg-ernieteal backdrop-blur-sm bg-opacity-50">
      <div
        className="flex flex-row items-center absolute top-6 right-6 gap-2"
        onClick={(e) => {
          completeTutorial();
        }}
      >
        <p className="font-circular text-erniecream text-md">Skip</p>
        <img src="/cross_cream.svg" className="w-5 h-5"></img>
      </div>
      <div className="h-[70%] w-full bg-erniecream ">
        <div className="flex flex-row h-4 w-full bg-erniedarkcream">
          <div
            className="h-full bg-erniegold"
            style={{ width: `${(tutorialStage / 4) * 100}%` }}
          ></div>
        </div>
        <div
          className={`absolute bottom-16 left-1/2 translate-x-[-50%] bg-erniegreen bg-opacity-50 rounded-lg p-4 opacity-0 ${
            animating && "fadeout"
          }`}
          onAnimationEnd={(e) => {
            setAnimating(false);
          }}
        >
          <p className="font-circular text-erniecream text-lg">Copied</p>
        </div>
        {tutorialStage == 0 && (
          <div className="flex flex-col h-[calc(100%-16px)]">
            <div className="flex flex-col p-6 gap-4 h-full">
              <img
                src="/tubs.jpg"
                className="h-[50%] w-full object-cover flex-grow"
              ></img>
              <p className="font-circe font-[900] text-erniegreen uppercase text-4xl mt-2">
                Welcome to the Ernie App
              </p>
              <div
                className="bg-erniegold px-4 py-2 rounded-lg cursor-pointer"
                onClick={() => setTutorialStage(1)}
              >
                <p className="font-circe font-[900] text-erniegreen uppercase text-xl text-center">
                  Learn more
                </p>
              </div>
            </div>
          </div>
        )}
        {tutorialStage == 1 && (
          <div className="h-full h-full flex flex-col justify-center px-6">
            {showingTerms ? (
              <div className="flex flex-col h-full pt-6 gap-6">
                <div
                  className="flex flex-row justify-end"
                  onClick={(e) => {
                    setShowingTerms(false);
                  }}
                >
                  <img src="/cross.svg" className="w-6 h-6"></img>
                </div>
                <p className="font-circular text-erniegreen text-lg overflow-y-scroll">
                  This 1kg Coffee Trial Campaign is exclusively for businesses
                  and workplaces within Zones 1 and 2 of London, specifically in
                  the hospitality sector, such as offices, hotels, restaurants,
                  and cafes. The offer is not available for domestic or personal
                  use. Eligible venues can receive one complimentary 1kg bag of
                  coffee for trial purposes, with the product intended solely
                  for sampling within the business. Multiple applications from
                  the same venue are not allowed. To participate, eligible
                  businesses must apply via the Company’s website or through the
                  designated campaign contact.
                </p>
              </div>
            ) : (
              <div className="flex flex-col">
                <img
                  src="/ordersummary.png"
                  className="aspect-square w-32 mx-auto mb-8"
                ></img>
                <h4 className="font-circe font-[900] uppercase text-erniegreen text-center text-2xl">
                  Try our coffee
                </h4>
                <p className="font-circular text-erniegreen text-center">
                  Use the code below to claim your FREE 1kg of our coffee.
                </p>
                <div
                  className="flex flex-row gap-2 mt-4 justify-center group cursor-pointer"
                  onClick={(e) => {
                    navigator.clipboard.writeText("FREECOFFEE");

                    setAnimating(true);
                  }}
                >
                  <p className="font-circular text-erniegreen text-lg font-[500] text-center group-hover:text-ernieteal">
                    FREECOFFEE
                  </p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -960 960 960"
                    className="w-6 h-6 fill-erniegreen group-hover:fill-ernieteal"
                  >
                    <path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z" />
                  </svg>
                </div>
              </div>
            )}
            <div
              className="flex flex-row justify-center absolute bottom-40 left-1/2 translate-x-[-50%]"
              onClick={() => {
                setShowingTerms(true);
              }}
            >
              <p className="font-circular text-erniegreen font-[500] text-lg cursor-pointer hover:text-erniegold">
                Terms & Conditions
              </p>
            </div>
            <div className="absolute w-[calc(100%-72px)] grid grid-cols-2 bottom-20">
              <div
                className={`flex flex-row gap-4 cursor-pointer ${
                  tutorialStage == 1 && "invisible"
                }`}
                onClick={() => setTutorialStage(tutorialStage - 1)}
              >
                <img src="/left-arrow-cream.svg" className="w-6"></img>
                <p className="font-circular text-erniecream">Previous</p>
              </div>
              <div
                className="flex flex-row justify-end gap-4 cursor-pointer"
                onClick={() => setTutorialStage(tutorialStage + 1)}
              >
                <p className="font-circular text-erniecream">Next</p>
                <img
                  src="/left-arrow-cream.svg"
                  className="w-6 rotate-[180deg]"
                ></img>
              </div>
            </div>
          </div>
        )}
        {tutorialStage == 2 && (
          <div className="h-full h-full flex flex-col justify-center px-6">
            <img
              src="/BIKE-WHEEL_COLOURED.webp"
              className="aspect-square w-36 mx-auto mb-8"
            ></img>
            <h4 className="font-circe font-[900] uppercase text-erniegreen text-center text-2xl">
              Start your subscription
            </h4>
            <p className="font-circular text-erniegreen text-center">
              You can set up and manage your subscription right from the Ernie
              App! Pick your products, and how often, and we&apos;ll deliver
              them to your office using pedal or electric power.
            </p>
            <div className="absolute w-[calc(100%-72px)] grid grid-cols-2 bottom-20">
              <div
                className={`flex flex-row gap-4 cursor-pointer ${
                  tutorialStage == 1 && "invisible"
                }`}
                onClick={() => setTutorialStage(tutorialStage - 1)}
              >
                <img src="/left-arrow-cream.svg" className="w-6"></img>
                <p className="font-circular text-erniecream">Previous</p>
              </div>
              <div
                className="flex flex-row justify-end gap-4 cursor-pointer"
                onClick={() => setTutorialStage(tutorialStage + 1)}
              >
                <p className="font-circular text-erniecream">Next</p>
                <img
                  src="/left-arrow-cream.svg"
                  className="w-6 rotate-[180deg]"
                ></img>
              </div>
            </div>
          </div>
        )}
        {tutorialStage == 3 && (
          <div className="h-full h-full flex flex-col justify-center px-6">
            <img
              src="/ROASTERY_COLOURED.webp"
              className="aspect-square w-36 mx-auto mb-8"
            ></img>
            <h4 className="font-circe font-[900] uppercase text-erniegreen text-center text-2xl">
              Create one-off orders
            </h4>
            <p className="font-circular text-erniegreen text-center">
              Need to top-up your beverages? Or want to try something new? Why
              not create a one-off order with us through the Ernie App.
            </p>
            <div className="absolute w-[calc(100%-72px)] grid grid-cols-2 bottom-20">
              <div
                className={`flex flex-row gap-4 cursor-pointer ${
                  tutorialStage == 1 && "invisible"
                }`}
                onClick={() => setTutorialStage(tutorialStage - 1)}
              >
                <img src="/left-arrow-cream.svg" className="w-6"></img>
                <p className="font-circular text-erniecream">Previous</p>
              </div>
              <div
                className="flex flex-row justify-end gap-4 cursor-pointer"
                onClick={() => setTutorialStage(tutorialStage + 1)}
              >
                <p className="font-circular text-erniecream">Next</p>
                <img
                  src="/left-arrow-cream.svg"
                  className="w-6 rotate-[180deg]"
                ></img>
              </div>
            </div>
          </div>
        )}
        {tutorialStage == 4 && (
          <div className="h-full h-full flex flex-col justify-center px-6">
            <img
              src="/HUGGING-WORLD_COLOURED.gif"
              className="aspect-square w-36 mx-auto mb-8"
            ></img>
            <h4 className="font-circe font-[900] uppercase text-erniegreen text-center text-2xl">
              Measure your impact
            </h4>
            <p className="font-circular text-erniegreen text-center">
              Ordering through us makes a positive impact to our impact. You can
              measure your impact through the impact tab.
            </p>
            <div className="absolute w-[calc(100%-72px)] flex flex-row justify-between bottom-16">
              <div
                className={`flex flex-row gap-4 cursor-pointer items-center ${
                  tutorialStage == 1 && "invisible"
                }`}
                onClick={() => setTutorialStage(tutorialStage - 1)}
              >
                <img src="/left-arrow-cream.svg" className="w-6"></img>
                <p className="font-circular text-erniecream">Previous</p>
              </div>
              <div
                className={`flex flex-row justify-end gap-4 cursor-pointer bg-erniegold rounded-lg p-4 items-center`}
                onClick={() => completeTutorial()}
              >
                <p className="font-circular text-erniegreen">Get Started</p>
                <img
                  src="/left-arrow.svg"
                  className="w-6 rotate-[180deg]"
                ></img>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
