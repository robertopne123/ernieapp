export const OrderComplete = ({ backToHome }) => {
  return (
    <div className="bg-erniecream flex flex-col h-full gap-4 pb-6 justify-center items-center">
      <p className="font-circe font-[900] text-erniegreen text-center uppercase text-2xl">
        Order Complete
      </p>
      <div
        className="bg-erniegreen p-4 mx-4 w-auto"
        onClick={() => backToHome()}
      >
        <p className="font-circe font-[900] uppercase text-erniecream text-center inline">
          Continue Browsing
        </p>
      </div>
    </div>
  );
};
