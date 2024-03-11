import React, { useState } from "react";

const defaultCart = {
  items: [],
  cartCount: 0,
  addToCart: (product) => {},
  removeFromCart: (productId) => {},
};

const CartContext = React.createContext(defaultCart);

export default CartContext;
