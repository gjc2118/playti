import * as firebase from 'firebase';

var fire = firebase.initializeApp({
    apiKey: "AIzaSyDqgIWKoA2z3zUqYtvDgnAjVKMD-p02Dbk",
    authDomain: "playtii-d3086.firebaseapp.com",
    databaseURL: "https://playtii-d3086.firebaseio.com",
    projectId: "playtii-d3086",
    storageBucket: "playtii-d3086.appspot.com",
    messagingSenderId: "1076204511391"
  });

// const fire = firebase.database();

export default fire;