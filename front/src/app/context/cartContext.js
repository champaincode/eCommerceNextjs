import React, { useState, useContext, createContext } from "react";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../../firebase"; // Asegúrate de importar la instancia de Firestore desde tu archivo de configuración
import { useAuth } from "./authContext";

export const cartContext = createContext();
export const useCartContext = () => {
  const context = useContext(cartContext);
  if (!context) throw new Error("context no exist");
  return context;
};

export const CartContextProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user } = useAuth();
  const userId = user?.uid; // Aquí debes obtener el ID del usuario actualmente autenticado

  // Agregar un producto al carrito y a Firestore

  const addToCart = async (products) => {
    try {
      const firestore = db;
      await setDoc(
        doc(firestore, "user", userId, "cart", products.id),
        products
      );
      setCart((prevCart) => [...prevCart, products]);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  // Obtener los productos del carrito desde Firestore
  const getCartItems = async () => {
    const firestore = db;
    const querySnapshot = await getDocs(
      collection(firestore, "user", userId, "cart")
    );
    let items = [];
    querySnapshot.forEach((doc) => {
      items.push({ docId: doc.id, ...doc.data() });
    });
    setCart(items);
  };
  // Eliminar un producto del carrito y de Firestore
  const removeFromCart = async (productId) => {
    try {
      const firestore = db;
      await deleteDoc(doc(firestore, "user", userId, "cart", productId));
      setCart((prevCart) =>
        prevCart.filter((product) => product.id !== productId)
      );
    } catch (e) {
      console.error("Error removing document: ", e);
    }
  };

  const logoutCart = async () => {
    setCart([]);
  };

  return (
    <cartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        getCartItems,
        removeFromCart,
        logoutCart,
      }}
    >
      {children}
    </cartContext.Provider>
  );
};
