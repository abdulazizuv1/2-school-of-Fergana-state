import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDoARlMVWhRVyB13DLkXedTpG7_dyFIdI0",
  authDomain: "school-2d328.firebaseapp.com",
  projectId: "school-2d328",
  storageBucket: "school-2d328.firebasestorage.app",
  messagingSenderId: "98833213676",
  appId: "1:98833213676:web:21460991e36bf4a5729dc9",
  measurementId: "G-K7V4L38TJC"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
