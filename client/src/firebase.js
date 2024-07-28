// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blogvibe.firebaseapp.com",
  projectId: "blogvibe",
  storageBucket: "blogvibe.appspot.com",
  messagingSenderId: "24579958521",
  appId: "1:24579958521:web:77a628218afe4b7972a428"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);