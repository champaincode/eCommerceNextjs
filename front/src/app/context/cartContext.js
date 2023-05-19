import React, { useState, useContext, createContext } from "react";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  getDoc,
  updateDoc,
  setDoc,
  increment,
  writeBatch,
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

  const addToCart = async (product) => {
    try {
      const firestore = db;
      const cartRef = doc(firestore, "user", userId, "cart", product.id);
      const cartSnap = await getDoc(cartRef);

      if (cartSnap.exists()) {
        // El producto ya existe en el carrito, aumentar la cantidad en 1
        await updateDoc(cartRef, {
          quantity: increment(1),
        });
      } else {
        // El producto no existe en el carrito, agregarlo con una cantidad de 1
        await setDoc(cartRef, {
          ...product,
          quantity: 1,
        });
      }

      setCart((prevCart) => [...prevCart, product]);
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

  const incrementQuantity = async (productId) => {
    try {
      const firestore = db;
      const cartRef = doc(firestore, "user", userId, "cart", productId);
      await updateDoc(cartRef, {
        quantity: increment(1),
      });
      setCart((prevCart) =>
        prevCart.map((product) =>
          product.id === productId
            ? { ...product, quantity: product.quantity + 1 }
            : product
        )
      );
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };

  const decrementQuantity = async (productId) => {
    try {
      const firestore = db;
      const cartRef = doc(firestore, "user", userId, "cart", productId);
      const cartSnap = await getDoc(cartRef);
      const currentQuantity = cartSnap.data().quantity;
      if (currentQuantity > 1) {
        await updateDoc(cartRef, {
          quantity: increment(-1),
        });
        setCart((prevCart) =>
          prevCart.map((product) =>
            product.id === productId
              ? { ...product, quantity: product.quantity - 1 }
              : product
          )
        );
      } else {
        await deleteDoc(cartRef);
        setCart((prevCart) =>
          prevCart.filter((product) => product.id !== productId)
        );
      }
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };

  const logoutCart = async () => {
    setCart([]);
  };
  const clearCart = async () => {
    try {
      const firestore = db;
      const batch = writeBatch(firestore);
      const querySnapshot = await getDocs(
        collection(firestore, "user", userId, "cart")
      );
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      setCart([]);
    } catch (e) {
      console.error("Error clearing cart: ", e);
    }
  };

  return (
    <cartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        getCartItems,
        removeFromCart,
        incrementQuantity,
        decrementQuantity,
        clearCart,
        logoutCart,
      }}
    >
      {children}
    </cartContext.Provider>
  );
};
