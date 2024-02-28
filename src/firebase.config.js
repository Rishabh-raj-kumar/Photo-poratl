// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB6I7E7PhPP5wx3d30oVgfec9vp-Yi7k7Y",
  authDomain: "portal-web-c0dd4.firebaseapp.com",
  projectId: "portal-web-c0dd4",
  storageBucket: "portal-web-c0dd4.appspot.com",
  messagingSenderId: "988164711121",
  appId: "1:988164711121:web:326c416c5a335a3a499bf0",
  measurementId: "G-0WJKY4MKQH"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);