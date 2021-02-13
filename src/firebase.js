import firebase from "firebase";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
//GET Below Settings from Firebase > Project Overview > Settings > General > Your apps > Firebase SDK snippet > Config
const firebaseConfig = {
    apiKey: "AIzaSyDNdMRue_sxo4B6kwb4dFk2oY2GNvrgphI",
    authDomain: "my-whatsapp-aec72.firebaseapp.com",
    projectId: "my-whatsapp-aec72",
    storageBucket: "my-whatsapp-aec72.appspot.com",
    messagingSenderId: "283307162217",
    appId: "1:283307162217:web:1f1452b6e7227d51e400f8",
    measurementId: "G-0222V19JY6"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const db = firebaseApp.firestore(); 
  const auth = firebaseApp.auth();
  const provider = new firebase.auth.GoogleAuthProvider();
  const storage = firebaseApp.storage()
  export { auth, provider, storage};
  export default db;
