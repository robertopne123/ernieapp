export const About = () => {
  return (
    <div className="flex flex-col">
      <div className="aspect-[16/10] overflow-hidden flex flex-col">
        <img
          src="/about.jpg"
          className="aspect-[16/12] object-cover translate-y-[-40px]"
        ></img>
      </div>
      <div className="p-6 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="font-circe font-[900] text-erniegreen uppercase text-xl">
            A little bit about us
          </p>
          <img src="/divider.png" className="w-full"></img>
        </div>
        <p className="font-circular text-sm text-erniegreen">
          We deliver locally roasted, specialty coffee and office pantry goodies
          via cargo bikes with zero reusable, recyclable packaging exclusively
          in London.
        </p>
      </div>
    </div>
  );
};
