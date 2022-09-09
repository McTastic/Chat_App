// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB2IjQu9BvNMBUqIfUqZEsX4JpNqbNJAK8",
  authDomain: "chat-app-2a2d0.firebaseapp.com",
  projectId: "chat-app-2a2d0",
  storageBucket: "chat-app-2a2d0.appspot.com",
  messagingSenderId: "901411414603",
  appId: "1:901411414603:web:408a053cde631d6cc163ce",
  measurementId: "G-0DPW2WZDN7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);