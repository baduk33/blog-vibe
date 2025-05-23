import { initializeApp } from "firebase/app";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDIXKi1BlqsmusJMkKcjgGF3xxDwiOql3E",
  authDomain: "blogapp-acbc3.firebaseapp.com",
  projectId: "blogapp-acbc3",
  storageBucket: "blogapp-acbc3.firebasestorage.app",
  messagingSenderId: "200923742040",
  appId: "1:200923742040:web:1e5ec2cef6e9595704af2d"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);