import React, { createContext, useContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { FIREBASE_AUTH as auth, database } from "../config/FirebaseConfig";
import { ref, set, get } from "firebase/database";
import { router } from "expo-router";

const UserContext = createContext();
const validateUserFields = (user) => {
  const requiredFields = ["email", "username", "password"];
  for (const field of requiredFields) {
    if (!user[field] || !user[field].trim()) {
      const error = new Error(
        `${field.charAt(0).toUpperCase() + field.slice(1)} cannot be empty.`
      );
      error.code = `auth/missing-${field}`;
      throw error;
    }
  }
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userAuth) => {
      handleUserAuth(userAuth);
    });

    return unsubscribe;
  }, []);

  const handleUserAuth = async (userAuth) => {
    if (userAuth) {
      const userRef = ref(database, `users/${userAuth.uid}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        setUser({ uid: userAuth.uid, ...snapshot.val() });
        router.push("/Profile");
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  const signUp = async (email, password, { username }) => {
    validateUserFields({ username, email, password });
    if (!email.includes("@")) {
      const error = new Error("Invalid email.");
      error.code = "auth/invalid-email";
      throw error;
    }
    try {
      const usernameSnapshot = await get(
        ref(database, `usernames/${username}`)
      );
      if (usernameSnapshot.exists()) {
        Alert.alert("The username you entered already exists.");
        return false;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userId = userCredential.user.uid;

      await set(ref(database, `usernames/${username}`), userId);
      await set(ref(database, `users/${userId}`), { email, username });

      setUser({ uid: userId, email, username });
      router.replace("/Profile");
      return true;
    } catch (error) {
      console.error("Error signing up:", error);

      if (auth.currentUser) {
        await auth.currentUser.delete();
      }

      throw error;
    }
  };

  const signIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userId = userCredential.user.uid;

      const userRef = ref(database, `users/${userId}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        setUser({ uid: userId, ...snapshot.val() });
      }
      router.push("/Profile");
    } catch (error) {
      throw error;
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      router.replace("/SignIn");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, signIn, signUp, logOut }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
