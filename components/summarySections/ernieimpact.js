import Image from "next/image";

export default function ErnieImpact({ quantity, role }) {
  return (
    <div className="flex flex-col gap-6 px-4 py-12 bg-erniemint overflow-auto flex-grow">
      <p className="uppercase font-circe font-[900] text-center text-4xl text-erniegreen">
        {role == 0 ? "Our Total Impact" : "Ernie's Total Impact"}
      </p>
      <div className="flex flex-row gap-2">
        <Image
          src="https://ernie.london/wp-content/uploads/2023/07/WASTE-COFFEE-BAG_COLOURED.gif"
          width={112}
          height={112}
          className="w-28 h-28"
          priority
        ></Image>
        <div className="flex flex-col justify-center pr-1">
          <p className="font-circe uppercase text-erniegreen text-4xl font-[900]">
            {24723 + Math.round((quantity * 0.44) / 1)}
          </p>
          <p className="font-circular font-[500] text-erniegreen">
            Bags directed from waste stream
          </p>
        </div>
      </div>
      <div className="flex flex-row gap-2">
        <Image
          src="https://ernie.london/wp-content/uploads/2023/07/HUGGING-WORLD_COLOURED.gif"
          width={112}
          height={112}
          className="w-28 h-28"
          priority
        ></Image>
        <div className="flex flex-col justify-center pr-1">
          <p className="font-circe uppercase text-erniegreen text-4xl font-[900]">
            {10878 +
              Math.round(quantity * 0.44 + Math.floor(quantity / 2) * 25)}
          </p>
          <p className="font-circular font-[500] text-erniegreen">
            Kgs of carbon removed from the atmosphere
          </p>
        </div>
      </div>
      <div className="flex flex-row gap-2">
        <Image
          src="https://ernie.london/wp-content/uploads/2023/07/TREE-GROWING_COLOURED.gif"
          width={112}
          height={112}
          className="w-28 h-28"
          priority
        ></Image>
        <div className="flex flex-col justify-center pr-1">
          <p className="font-circe uppercase text-erniegreen text-4xl font-[900]">
            {Math.floor((24723 + quantity) / 6)}
          </p>
          <p className="font-circular font-[500] text-erniegreen">
            Trees planted
          </p>
        </div>
      </div>
      <div className="flex flex-row gap-2">
        <Image
          src="https://ernie.london/wp-content/uploads/2023/07/HUGGING-COFFEE_COLOURED.gif"
          width={112}
          height={112}
          className="w-28 h-28"
          priority
        ></Image>
        <div className="flex flex-col justify-center pr-1">
          <p className="font-circe uppercase text-erniegreen text-4xl font-[900]">
            {(24723 + quantity) * 100}
          </p>
          <p className="font-circular font-[500] text-erniegreen">
            Cups of coffee enjoyed by you
          </p>
        </div>
      </div>
      <div className="flex flex-row gap-2">
        <Image
          src="https://ernie.london/wp-content/uploads/2023/07/PHONE-CHARGE_COLOURED.gif"
          width={112}
          height={112}
          className="w-28 h-28"
          priority
        ></Image>
        <div className="flex flex-col justify-center pr-1">
          <p className="font-circe uppercase text-erniegreen text-4xl font-[900]">
            {Math.round((24723 + quantity) * 0.44 * 196)}
          </p>
          <p className="font-circular font-[500] text-erniegreen">
            Phones charged from Tco2e saved
          </p>
        </div>
      </div>
      <div className="flex flex-row gap-2">
        <Image
          src="https://ernie.london/wp-content/uploads/2023/07/CAR_COLOURED.gif"
          width={112}
          height={112}
          className="w-28 h-28"
          priority
        ></Image>
        <div className="flex flex-col justify-center pr-1">
          <p className="font-circe uppercase text-erniegreen text-4xl font-[900]">
            {Math.round((quantity * 0.44) / 32.148) < 1
              ? Math.round((((24723 + quantity) * 0.44) / 32.148) * 100) / 100
              : Math.round(((24723 + quantity) * 0.44) / 32.148)}
          </p>
          <p className="font-circular font-[500] text-erniegreen">
            Loops of the M25 worth of carbon saved
          </p>
        </div>
      </div>
    </div>
  );
}
