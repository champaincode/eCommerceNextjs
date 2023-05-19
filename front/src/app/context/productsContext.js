import React, { useState, useEffect, useContext, createContext } from "react";
import { collection, getDocs } from "firebase/firestore";
import { firebaseApp } from "../../firebase";
import { db } from "../../firebase";

const productsContext = createContext();

export const useProductsContext = () => {
  const context = useContext(productsContext);
  if (!context) throw new Error("context no exist");
  return context;
};

export const ProductsContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getProductos() {
      const productosCol = collection(db, "products");
      const productosSnapshot = await getDocs(productosCol);
      const productosList = productosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productosList);
      setIsLoading(false);
    }
    getProductos();
  }, []);

  return (
    <productsContext.Provider
      value={{
        products,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </productsContext.Provider>
  );
};
