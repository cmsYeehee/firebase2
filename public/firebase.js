// Import the Firebase SDK
import firebase from 'firebase/app';
import 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCvPK986ukR-ZeqxWIc7-F2gEvPZ_-v6P4",
  authDomain: "topicsisaclass.firebaseapp.com",
  projectId: "topicsisaclass",
  storageBucket: "topicsisaclass.appspot.com",
  messagingSenderId: "29876524126",
  appId: "1:29876524126:web:e0932cae4c90df79c150cf"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Get a reference to the Firestore database
const db = firebase.firestore();

// Export the Firestore instance
export { db };
