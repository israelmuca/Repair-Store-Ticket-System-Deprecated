// Initialize Firebase
var config = {
    apiKey: "AIzaSyAYkl5opTyW9YF7801KmgT9YUhpV0JhYGY",
    authDomain: "notas-xtm-fixc.firebaseapp.com",
    databaseURL: "https://notas-xtm-fixc.firebaseio.com",
    projectId: "notas-xtm-fixc",
    storageBucket: "notas-xtm-fixc.appspot.com",
    messagingSenderId: "768789228246"
};

firebase.initializeApp(config);

/*Take the user to the search page (for local work)*/
var oldURL = window.location.href;
var newURL = oldURL.replace("login", "index");
/*Otherwise, use the full url for index*/

// FirebaseUI config.
var uiConfig = {
    signInSuccessUrl: newURL,
    signInOptions: [
        // Gmail or email auth
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
    // Terms of service url.
    tosUrl: '' //we'll get there...
};
// Initialize the FirebaseUI Widget using Firebase.
var loginUI = new firebaseui.auth.AuthUI(firebase.auth());
// The start method will wait until the DOM is loaded.
loginUI.start('#login-ui', uiConfig);