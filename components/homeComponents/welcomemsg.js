export const WelcomeMsg = ({ name }) => {
  return (
    <div className="flex flex-col gap-2 px-6 mt-6">
      <p className="font-circe text-xl text-erniegreen font-[900] uppercase">
        Welcome {name},
      </p>
      <p className="font-circular text-erniegreen font-[500] text-sm">
        With the Ernie app, you can manage your subscription, purchase new
        products, track your impact and update your account.
      </p>
    </div>
  );
};
