import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDpkuFWoHdsGiTgZssuTtJKRPYM7r1n-YM",
  authDomain: "websitev2-96c80.firebaseapp.com",
  projectId: "websitev2-96c80",
  storageBucket: "websitev2-96c80.firebasestorage.app",
  messagingSenderId: "518025032253",
  appId: "1:518025032253:web:4b877fceda65950e2df054",
  measurementId: "G-HWB5KFW5X3"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
