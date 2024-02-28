// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import {getFirestore} from "firebase/firestore"
//import storage
import {getStorage, ref} from "firebase/storage"
 
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDjRey8BVFrhgOPU2hM9783Wo_rZ8xaL7w",
  authDomain: "reactchatapp-bc27b.firebaseapp.com",
  projectId: "reactchatapp-bc27b",
  storageBucket: "reactchatapp-bc27b.appspot.com",
  messagingSenderId: "897722953487",
  appId: "1:897722953487:web:ddafe6239042f80116187a",
  measurementId: "G-MDPEMMYBTK"
};

// Initialize Firebas
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app); 
export const googleProvider = new GoogleAuthProvider();

//firestore
export const db  = getFirestore(app);

//storage
export const storage = getStorage(app);