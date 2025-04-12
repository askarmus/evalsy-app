// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCbjFm4jQEQVzofUHFIIWGs2g6_Pj0CDME",
  authDomain: "interview-ai-438303.firebaseapp.com",
  projectId: "interview-ai-438303",
  storageBucket: "interview-ai-438303.firebasestorage.app",
  messagingSenderId: "712395192764",
  appId: "1:712395192764:web:9f100d1b186aad77cc53b9",
  measurementId: "G-8FZZR0EZ7X",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services you need
export const db = getFirestore(app);
