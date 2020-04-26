import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCug_Ntn0HZLTEYBNXr08VVXkQIdnRo0WQ",
  authDomain: "fairy-tales-4-us.firebaseapp.com",
  databaseURL: "https://fairy-tales-4-us.firebaseio.com",
  projectId: "fairy-tales-4-us",
  storageBucket: "fairy-tales-4-us.appspot.com",
  messagingSenderId: "84799391923",
  appId: "1:84799391923:web:c98ebbbffc44d6c57508c6",
  measurementId: "G-Q42C9Q1HMS",
};

firebase.initializeApp(firebaseConfig);

export default firebase;
