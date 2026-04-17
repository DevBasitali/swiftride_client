// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDPjYISCeGi0cI_zGNzEssdDkIWWvRehac",
  authDomain: "swiftride-bb457.firebaseapp.com",
  projectId: "swiftride-bb457",
  storageBucket: "swiftride-bb457.firebasestorage.app",
  messagingSenderId: "64519527429",
  appId: "1:64519527429:web:bdbb849ca82e673260d06c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');

export { auth, googleProvider };
