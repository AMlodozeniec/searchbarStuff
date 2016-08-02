// Initialize Firebase
var config = {
    apiKey: "AIzaSyCiLOzL7NP-vVOiJbjxrNhVTxBd-yKZfOE",
    authDomain: "wallplay-a8440.firebaseapp.com",
    databaseURL: "https://wallplay-a8440.firebaseio.com",
    storageBucket: "wallplay-a8440.appspot.com",
  };

firebase.initializeApp(config);

// Get a reference to the database service  
var database = firebase.database();
console.log("firebase is up")