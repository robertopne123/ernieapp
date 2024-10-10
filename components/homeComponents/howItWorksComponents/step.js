export const Step = ({ step, line, gif }) => {
  return (
    <div className="step flex flex-col gap-2">
      <p className="font-circe font-[900] text-erniegreen text-xl lg:text-2xl text-center uppercase">
        {step}
      </p>
      <img className="w-32 h-32 mx-auto" src={gif}></img>
      <p className="font-circe font-[900] text-erniegreen text-center uppercase lg:text-lg">
        {line}
      </p>
    </div>
  );
};
