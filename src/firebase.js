// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage, ref } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAd4dF-CMxW6SBKBKPBfWlXPJZbS-lVxRE",
  authDomain: "chat-app-e4929.firebaseapp.com",
  projectId: "chat-app-e4929",
  storageBucket: "chat-app-e4929.appspot.com",
  messagingSenderId: "287820663663",
  appId: "1:287820663663:web:b5e1e425cd5746c258369a",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore(app);
