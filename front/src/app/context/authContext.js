import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import firebaseApp from "../../firebase";
const firestore = getFirestore(firebaseApp);
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { auth } from "../../firebase";

const authContext = createContext();

export const useAuth = () => {
  const context = useContext(authContext);
  if (!context) throw new Error("contexto no exist");
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signup = async (email, password, nombre, apellido) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    if (userCredential.user) {
      const docuRef = doc(firestore, `user/${userCredential.user.uid}`);
      await setDoc(docuRef, {
        nombre: nombre,
        apellido: apellido,
        email: userCredential.user.email,
        id: userCredential.user.uid,
      });
    }
    return userCredential;
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  //   const loginWithGoogle = () => {
  //     const googleProvider = new GoogleAuthProvider();
  //     return signInWithPopup(auth, googleProvider);
  //   };

  const logout = () => signOut(auth);

  //   const resetPassword = async (email) => sendPasswordResetEmail(auth, email);

  useEffect(() => {
    const unsubuscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log({ currentUser });
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubuscribe();
  }, []);

  return (
    <authContext.Provider
      value={{
        signup,
        login,
        user,
        logout,
      }}
    >
      {children}
    </authContext.Provider>
  );
}
