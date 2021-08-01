import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBif_j0CdaCaj3YgTEZLW7uvw9XHDIK6Cc",
  authDomain: "smochat-701ec.firebaseapp.com",
  projectId: "smochat-701ec",
  storageBucket: "smochat-701ec.appspot.com",
  messagingSenderId: "326183387253",
  appId: "1:326183387253:web:af4fd47746180944b2383c",
  measurementId: "G-Y7G6ZC6WEM"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };