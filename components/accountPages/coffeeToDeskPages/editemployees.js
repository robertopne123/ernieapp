export default function EditEmployees({ backAction, employees }) {
  return (
    <div className="flex flex-col flex-grow px-4 pt-10 gap-4 h-full">
      <div
        className="absolute top-0 left-0 p-6 bg-erniemint w-full"
        onClick={backAction}
      >
        <img src="/left-arrow.svg" className="w-6"></img>
      </div>
      <p className="uppercase font-circe font-[900] text-4xl text-erniegreen mt-16">
        View Employees
      </p>
      <div className="flex flex-col h-full overflow-auto pb-12">
        {employees?.map((employee, index) => (
          <div key={index} className="flex flex-col">
            <div
              className={`flex flex-row justify-between border-l-[2px] border-r-[2px] border-erniegreen flex-grow w-full ${
                index == 0
                  ? "border-t-[2px] border-b-[1px]"
                  : index == employees.length - 1
                  ? "border-t-[1px] border-b-[2px]"
                  : "border-t-[1px] border-b-[1px]"
              }`}
            >
              <div className="flex flex-col px-4 py-4">
                <p className="font-circular text-erniegreen font-[500] text-left text-xl">
                  {employee.name}
                </p>
                <p className="font-circular text-erniegreen font-[500] text-left">
                  {employee.email}
                </p>
              </div>
              {/* <div className="bg-erniegreen h-full w-12 p-4 flex flex-col justify-center hover:bg-ernieteal border-l-2 border-erniegreen">
                <img src="/close.svg" className="w-full"></img>
              </div> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
