import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyAEAb5utelxTI6JQ7e6CjISoEl03GmMxus",
    authDomain: "multiplayer-hangman-9fbd8.firebaseapp.com",
    projectId: "multiplayer-hangman-9fbd8",
    storageBucket: "multiplayer-hangman-9fbd8.appspot.com",
    messagingSenderId: "595764832481",
    appId: "1:595764832481:web:d47a495a29006f6be5afa0"
  };



const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


export { db };