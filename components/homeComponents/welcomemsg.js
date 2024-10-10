export const WelcomeMsg = ({ name }) => {
  return (
    <div className="flex flex-col gap-2 px-6 lg:px-10 mt-6 lg:mt-10">
      <p className="font-circe text-xl text-erniegreen font-[900] uppercase lg:text-2xl">
        Welcome {name},
      </p>
      <p className="font-circular text-erniegreen font-[500] text-sm lg:text-base">
        With the Ernie app, you can manage your subscription, purchase new
        products, track your impact and update your account.
      </p>
    </div>
  );
};
