import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDV6N3VAAiJcIzrJPrPMuyeWHY0QGQ82U8",
  authDomain: "thoughts-e3ff0.firebaseapp.com",
  databaseURL: "https://thoughts-e3ff0-default-rtdb.asia-southeast1.firebasedatabase.app", 
  projectId: "thoughts-e3ff0",
  storageBucket: "thoughts-e3ff0.firebasestorage.app",
  messagingSenderId: "976659299217",
  appId: "1:976659299217:web:1bee0fe42e6d8aed3b3830",
  measurementId: "G-W5MB32X0BY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
