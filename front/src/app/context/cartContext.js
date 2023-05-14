import React, { useState, useContext, createContext } from "react";

export const cartContext = createContext();
export const useCartContext = () => {
  const context = useContext(cartContext);
  if (!context) throw new Error("context no exist");
  return context;
};

export const CartContextProvider = ({ children }) => {
  const [cart, setCart] = useState([
    { name: "Notebook", price: 1000, quantity: 1 },
    { name: "Celular", price: 1500, quantity: 1 },
  ]);

  return (
    <cartContext.Provider value={{ cart, setCart }}>
      {children}
    </cartContext.Provider>
  );
};
