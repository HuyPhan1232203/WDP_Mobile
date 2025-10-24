// config/firebase.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import * as firebaseAuth from "firebase/auth";
import { initializeAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAgkBSziF_pj_EK2A3q8oq17zU9NWEwNXw",
  authDomain: "wdp301-5dae6.firebaseapp.com",
  projectId: "wdp301-5dae6",
  storageBucket: "wdp301-5dae6.firebasestorage.app",
  messagingSenderId: "871536505605",
  appId: "1:871536505605:web:43035e9393daa5538f7d6c",
};

const app = initializeApp(firebaseConfig);

const reactNativePersistence = (firebaseAuth as any).getReactNativePersistence;

const auth = initializeAuth(app, {
  persistence: reactNativePersistence(AsyncStorage),
});

export { app, auth };
