import { Basket } from "./basket";

export const StaticTopBar = ({
  addToSubBasket,
  addToOneOffBasket,
  updateSubBasket,
  updateOneOffBasket,
  setNewSubFrequency,
  newSubFreq,
  subBasket,
  oneOffBasket,
}) => {
  const addToSubBasketFromBar = (item) => {
    addToSubBasket(item);
  };

  const addToOneOffBasketFromBar = (item) => {
    addToOneOffBasket(item);
  };

  const updateSubBasketFromBar = (basketCopy) => {
    updateSubBasket(basketCopy);
  };

  const updateOneOffBasketFromBar = (basketCopy) => {
    updateOneOffBasket(basketCopy);
  };

  const updateNewSubFreqFromBar = (freq) => {
    setNewSubFrequency(freq);
  };

  return (
    <div className="h-20 w-full bg-ernieteal py-4 px-6 flex flex-row justify-between z-[999]">
      <img src="/Asset-1@2x2.png" className="w-32 my-auto"></img>
      <Basket
        addToSubBasket={addToSubBasketFromBar}
        addToOneOffBasket={addToOneOffBasketFromBar}
        updateSubBasket={updateSubBasketFromBar}
        updateOneOffBasket={updateOneOffBasketFromBar}
        setNewSubFrequency={updateNewSubFreqFromBar}
        newSubFreq={newSubFreq}
        subBasket={subBasket}
        oneOffBasket={oneOffBasket}
      />
    </div>
  );
};
