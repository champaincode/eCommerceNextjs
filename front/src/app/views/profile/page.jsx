"use client";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useAuth } from "@/app/context/authContext";

async function getUserName(userId) {
  const userDoc = doc(db, "user", userId);
  const snapshot = await getDoc(userDoc);
  if (snapshot.exists()) {
    const userData = snapshot.data();
    return userData;
  } else {
    // El documento no existe
    return "NO EXISTE NOMBRE";
  }
}

function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const userId = user?.uid;

  useEffect(() => {
    async function fetchUserName() {
      if (user?.uid !== "undefined") {
        const data = await getUserName(userId);
        setUserData(data);
        setLoading(false);
      }
    }
    fetchUserName();
  }, []);
  console.log(userData, "USER DATAAA");

  return (
    <>
      {loading ? (
        <div>Cargando..</div>
      ) : (
        <div>
          <div>Nombre del usuario:{userData?.nombre}</div>
          <div>
            Apellido del usuario:
            {userData?.apellido}
          </div>
          <div>Email de registro:{userData?.email}</div>
        </div>
      )}
    </>
  );
}

export default Profile;
