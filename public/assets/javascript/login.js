// Initialize Firebase
// 'config' is being imported through the HTML's script tag (./.env/firebase.config.js)
// For your own development, you need to change the 'example.env' folder to '.env' and change the values inside to reflect the values you get from Firebase
firebase.initializeApp(config);

// URL values to get the user to the main page once they login
// They won't work in development, only once deployed
// For local development you have to manually go to the index.html
var oldURL = window.location.href;
var newURL = oldURL.replace("login", "index");

// FirebaseUI config
var uiConfig = {
    signInSuccessUrl: newURL, // Our URL above
    signInOptions: [
        // In here you can change the authorization providers you wish to use
        // I chose Google and custom email
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
    // Terms of service url.
    tosUrl: ''
};
// Initialize the FirebaseUI Widget using Firebase.
var loginUI = new firebaseui.auth.AuthUI(firebase.auth());

// The start method will wait until the DOM is loaded and then will put the login box in the UI
loginUI.start('#login-ui', uiConfig);