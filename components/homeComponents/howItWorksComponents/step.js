export const Step = ({ step, line, gif }) => {
  return (
    <div className="step flex flex-col gap-2">
      <p className="font-circe font-[900] text-erniegreen text-xl text-center uppercase">
        {step}
      </p>
      <img className="w-32 h-32 mx-auto" src={gif}></img>
      <p className="font-circe font-[900] text-erniegreen text-center uppercase">
        {line}
      </p>
    </div>
  );
};
