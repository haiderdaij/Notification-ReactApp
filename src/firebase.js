// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: "notifications-315fe.firebaseapp.com",
  projectId: "notifications-315fe",
  storageBucket: "notifications-315fe.appspot.com",
  messagingSenderId: "556526200380",
  appId: "1:556526200380:web:6fe472a7a0684937a5c539",
  measurementId: "G-5Y2RDHQB4Y",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
