//import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDsfPcGKup3Df6XP2QyM7zgn8Z0vk1SdVM",
  authDomain: "gymapp-f4c79.firebaseapp.com",
  projectId: "gymapp-f4c79",
  storageBucket: "gymapp-f4c79.appspot.com",
  messagingSenderId: "182569886612",
  appId: "1:182569886612:web:8aa1b65869038388246581",
  measurementId: "G-0WFCLMLJQ9",
  databaseURL:
    "https://gymapp-f4c79-default-rtdb.europe-west1.firebasedatabase.app",
};

export const FIREBASE_APP = initializeApp(firebaseConfig);

export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const database = getDatabase(FIREBASE_APP);
export const db = getFirestore(FIREBASE_APP);

//const analytics = getAnalytics(app);
