import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


/* FIREBASE CONFIG */

const firebaseConfig = {
    apiKey: "AIzaSyAxyLLVOB0ohRixJGQd8lV7fYS9wpF90qo",
    authDomain: "ai-summarizer-df0ea.firebaseapp.com",
    projectId: "ai-summarizer-df0ea",
    storageBucket: "ai-summarizer-df0ea.firebasestorage.app",
    messagingSenderId: "536922483371",
    appId: "1:536922483371:web:37f6e789ff729d692ba5ee",
    measurementId: "G-P7PJEGR2GS"
};


/* INITIALIZE FIREBASE */

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();


/* GOOGLE LOGIN FUNCTION */

window.googleLogin = async function () {

    try {

        const result = await signInWithPopup(auth, provider);

        const user = result.user;

        console.log("User logged in:", user);

        alert("Welcome " + user.displayName);

    } catch (error) {

        console.error("Login error:", error);

        alert("Google login failed");

    }

};


/* LOGOUT FUNCTION (optional) */

window.logoutUser = async function () {

    await signOut(auth);

    alert("Logged out");

};


/* AUTH STATE LISTENER */

onAuthStateChanged(auth, (user) => {

    if (user) {

        console.log("User active:", user.email);

    } else {

        console.log("No user logged in");

    }

});