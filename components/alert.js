export default function Alert({ message, type, close, action, designStyle }) {
  const actionFromAlert = () => {
    action();
  };

  return (
    <>
      <div
        className={`w-full h-full absolute left-0 top-0 flex flex-col items-center py-16 alert ${
          type == "Confirm" && "backdrop-blur justify-center"
        } z-[999]`}
      >
        <div
          className={`w-[85%] flex flex-col bg-erniegreen ${
            type != "Confirm" && "shadow-xl rounded-xl"
          }`}
        >
          <div className="p-4">
            <p className="font-circe text-erniecream uppercase text-center font-[900] text-lg">
              {message}
            </p>
          </div>
          {type == "Confirm" && (
            <div className="flex flex-row gap-4 justify-center pb-4">
              <div
                className="bg-erniecream p-2 flex flex-col justify-center px-8"
                onClick={(e) => {
                  actionFromAlert();
                  close();
                }}
              >
                <p className="font-circe text-erniegreen uppercase">Yes</p>
              </div>
              <div
                className="bg-erniecream p-2 flex flex-col justify-center px-8"
                onClick={(e) => {
                  close();
                }}
              >
                <p className="font-circe text-erniegreen uppercase">No</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
