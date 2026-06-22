import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB9Yv3l7l6b_ONzneukkVhFf50INXIwu0o",
  authDomain: "nimasa-tex-e19b9.firebaseapp.com",
  projectId: "nimasa-tex-e19b9",
  storageBucket: "nimasa-tex-e19b9.firebasestorage.app",
  messagingSenderId: "296116256862",
  appId: "1:296116256862:web:1a459fe7528e6bf91334cf",
  measurementId: "G-4BYE7FZDPJ"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
