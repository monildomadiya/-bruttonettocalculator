import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAreQ8aNnBESPVuBlAWbFJ6UPEQZGUoIRI",
  authDomain: "brutto-netto-be31f.firebaseapp.com",
  projectId: "brutto-netto-be31f",
  storageBucket: "brutto-netto-be31f.firebasestorage.app",
  messagingSenderId: "1000188350831",
  appId: "1:1000188350831:web:695b13a80d82f3c7ed989a",
  measurementId: "G-EJTN380LS9"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// Initialize Analytics safely (only supported in browser)
let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((yes) => yes && (analytics = getAnalytics(app)));
}

export { app, auth, analytics, firebaseConfig };
