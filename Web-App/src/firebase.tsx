// Web-App/src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Replace these with your actual Firebase project configuration values from the Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyBZ-RRRunVxXPHpaVtlfziTuayaYoJkNHU",
  authDomain: "bookacrib-dev-c2873.firebaseapp.com",
  projectId:  "bookacrib-dev-c2873",
  storageBucket:  "bookacrib-dev-c2873.firebasestorage.app",
  messagingSenderId:  "564203486245",
  appId: "1:564203486245:web:f4b0c345262fdf356d13cc"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);