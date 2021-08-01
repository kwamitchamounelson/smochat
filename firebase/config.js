import firebase from 'firebase/app'

// Optionally import the services that you want to use
import "firebase/auth";
//import "firebase/database";
//import "firebase/firestore";
//import "firebase/functions";
//import "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBif_j0CdaCaj3YgTEZLW7uvw9XHDIK6Cc",
    authDomain: "smochat-701ec.firebaseapp.com",
    projectId: "smochat-701ec",
    storageBucket: "smochat-701ec.appspot.com",
    messagingSenderId: "326183387253",
    appId: "1:326183387253:web:af4fd47746180944b2383c",
    measurementId: "G-Y7G6ZC6WEM"
};

firebase.initializeApp(firebaseConfig);