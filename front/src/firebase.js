// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDGbrzEVwEVoWqSTQBFmacWymFh8wiXQf0",
  authDomain: "ecommerce-crud-eeefa.firebaseapp.com",
  projectId: "ecommerce-crud-eeefa",
  storageBucket: "ecommerce-crud-eeefa.appspot.com",
  messagingSenderId: "240644595653",
  appId: "1:240644595653:web:9d6670c29582cd351f35ac",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

export default firebaseApp;
