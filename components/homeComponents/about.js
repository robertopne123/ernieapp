export const About = () => {
  return (
    <div className="flex flex-col lg:flex-row">
      <div className="aspect-[16/10] lg:aspect-none overflow-hidden flex flex-col lg:w-1/2">
        <img
          src="/about.jpg"
          className="aspect-[16/12] lg:aspect-none object-cover translate-y-[-40px]"
        ></img>
      </div>
      <div className="p-6 lg:p-10 flex flex-col gap-4 lg:w-1/2 lg:bg-erniedarkcream">
        <div className="flex flex-col gap-2">
          <p className="font-circe font-[900] text-erniegreen uppercase text-xl lg:text-2xl">
            A little bit about us
          </p>
          <img src="/divider.png" className="w-full"></img>
        </div>
        <p className="font-circular text-sm lg:text-base text-erniegreen">
          We deliver locally roasted, specialty coffee and office pantry goodies
          via cargo bikes with zero reusable, recyclable packaging exclusively
          in London.
        </p>
      </div>
    </div>
  );
};
