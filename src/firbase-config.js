import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyD1xqIk_ycImXsX2z-Rf5joAxwCeZf9ka0",
    authDomain: "fbchat-a168e.firebaseapp.com",
    projectId: "fbchat-a168e",
    storageBucket: "fbchat-a168e.appspot.com",
    messagingSenderId: "292910452290",
    appId: "1:292910452290:web:c7fc86b45e83a3cca427db",
    measurementId: "G-3GD7CM52VF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();