import Image from "next/image";
import { useState } from "react";

export const Tutorial = ({ completeTutorial }) => {
  const [tutorialStage, setTutorialStage] = useState(0);

  return (
    <div className="absolute top-0 z-[999] bg-ernieteal h-screen w-screen flex flex-col">
      <div className="flex flex-row h-4 w-full bg-erniegreen">
        <div
          className="h-full bg-erniegold"
          style={{ width: `${(tutorialStage / 4) * 100}%` }}
        ></div>
      </div>
      {tutorialStage == 0 && (
        <div className="flex flex-col h-full">
          <div className="flex flex-col aspect-[4/6] relative">
            <Image
              width={100}
              height={100}
              src={"/tubs.jpg"}
              className="w-full h-full object-cover"
            />
            <div className="bg-gradient-to-b from-transparent via-transparent to-ernieteal absolute h-full w-full"></div>
          </div>
          <div className="flex flex-col px-6 gap-4">
            <p className="font-circe font-[900] text-erniecream uppercase text-4xl">
              Welcome to the Ernie App
            </p>
            <div
              className="bg-erniegold p-4 w-full"
              onClick={() => setTutorialStage(1)}
            >
              <p className="font-circe font-[900] text-erniegreen uppercase text-xl text-center">
                Learn More
              </p>
            </div>
          </div>
        </div>
      )}
      {tutorialStage == 1 && (
        <div className="h-full h-full flex flex-col justify-center px-6">
          <img className="bg-slate-200 aspect-square w-32 mx-auto mb-8"></img>
          <h4 className="font-circe font-[900] uppercase text-erniecream text-center text-2xl">
            Do this then that
          </h4>
          <p className="font-circular text-erniecream text-center">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <div className="absolute w-[calc(100%-48px)] grid grid-cols-2 bottom-20">
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
          <img className="bg-slate-200 aspect-square w-32 mx-auto mb-8"></img>
          <h4 className="font-circe font-[900] uppercase text-erniecream text-center text-2xl">
            Do this then that
          </h4>
          <p className="font-circular text-erniecream text-center">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <div className="absolute w-[calc(100%-48px)] grid grid-cols-2 bottom-20">
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
          <img className="bg-slate-200 aspect-square w-32 mx-auto mb-8"></img>
          <h4 className="font-circe font-[900] uppercase text-erniecream text-center text-2xl">
            Do this then that
          </h4>
          <p className="font-circular text-erniecream text-center">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <div className="absolute w-[calc(100%-48px)] grid grid-cols-2 bottom-20">
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
          <img className="bg-slate-200 aspect-square w-32 mx-auto mb-8"></img>
          <h4 className="font-circe font-[900] uppercase text-erniecream text-center text-2xl">
            Do this then that
          </h4>
          <p className="font-circular text-erniecream text-center">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <div className="absolute w-[calc(100%-48px)] grid grid-cols-2 bottom-20">
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
              onClick={() => completeTutorial()}
            >
              <p className="font-circular text-erniecream">Get Started</p>
              <img
                src="/left-arrow-cream.svg"
                className="w-6 rotate-[180deg]"
              ></img>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
