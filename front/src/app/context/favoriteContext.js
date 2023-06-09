import React, { useState, useContext, createContext } from "react";
import { toast } from "sonner";
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
import { db } from "../../firebase";
import { useAuth } from "./authContext";

export const favoriteContext = createContext();
export const useFavoriteContext = () => {
  const context = useContext(favoriteContext);
  if (!context) throw new Error("context no exist");
  return context;
};

export const FavoriteContextProvider = ({ children }) => {
  const [favorite, setFavorite] = useState([]);
  const { user } = useAuth();
  const userId = user?.uid;

  const addToFavorite = async (product, setIsFavorite) => {
    try {
      const firestore = db;
      const favoriteRef = doc(
        firestore,
        "user",
        userId,
        "favorite",
        product.id
      );
      const favoriteSnap = await getDoc(favoriteRef);

      if (favoriteSnap.exists()) {
        toast.success("El producto ya esta agregado");
      } else {
        toast("¿Quieres agregar este producto a tus favoritos", {
          action: {
            label: (
              <p
                style={{
                  marginTop: "5px",
                  height: "200px",
                  width: "100px",
                  textAlign: "center",
                }}
              >
                Agregar
              </p>
            ),
            onClick: () => {
              toast.success("Agregaste este producto a tus favoritos");
              setDoc(favoriteRef, {
                ...product,
                quantity: 1,
              });
              setIsFavorite(true);
            },
          },
        });
      }

      setFavorite((prevFavorite) => [...prevFavorite, product]);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const getFavoriteItems = async () => {
    const firestore = db;
    const querySnapshot = await getDocs(
      collection(firestore, "user", userId, "favorite")
    );
    let items = [];
    querySnapshot.forEach((doc) => {
      items.push({ docId: doc.id, ...doc.data() });
    });
    setFavorite(items);
  };

  const removeFromFavorite = async (productId, setIsFavorite) => {
    try {
      const firestore = db;
      toast("¿Quieres sacar este producto a tus favoritos", {
        action: {
          label: (
            <p
              style={{
                marginTop: "5px",
                height: "200px",
                width: "100px",
                textAlign: "center",
              }}
            >
              Sacar
            </p>
          ),
          onClick: () => {
            deleteDoc(doc(firestore, "user", userId, "favorite", productId));
            setFavorite((prevFavorite) =>
              prevFavorite.filter((product) => product.id !== productId)
            );
            toast.success("Sacaste este producto a tus favoritos");
            setIsFavorite(false);
          },
        },
      });
    } catch (e) {
      console.error("Error removing document: ", e);
    }
  };

  const clearFavorite = async () => {
    try {
      const firestore = db;
      const batch = writeBatch(firestore);
      const querySnapshot = await getDocs(
        collection(firestore, "user", userId, "favorite")
      );
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      setFavorite([]);
    } catch (e) {
      console.error("Error clearing favorite: ", e);
    }
  };

  const logoutFavorite = async () => {
    setFavorite([]);
  };

  return (
    <favoriteContext.Provider
      value={{
        addToFavorite,
        logoutFavorite,
        getFavoriteItems,
        removeFromFavorite,
        clearFavorite,
        favorite,
      }}
    >
      {children}
    </favoriteContext.Provider>
  );
};
