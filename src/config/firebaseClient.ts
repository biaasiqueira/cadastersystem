import firebaseClient from "firebase/compat/app";
import "firebase/compat/auth";
import firebase from 'firebase/compat/app'
// the below imports are option - comment out what you don't need
import 'firebase/compat/firestore'
import 'firebase/compat/storage'
import 'firebase/compat/analytics'
import 'firebase/compat/performance'
/*
Copy/paste your *client-side* Firebase credentials below.
To get these, go to the Firebase Console > open your project > Gear Icon >
Project Settings > General > Your apps. If you haven't created a web app
already, click the "</>" icon, name your app, and copy/paste the snippet.
Otherwise, go to Firebase SDK Snippet > click the "Config" radio button >
copy/paste.
*/


const CLIENT_CONFIG = {
    apiKey: "AIzaSyA9WMlJ_jymV3css3qDK-opSFmMHLqcDRA",
    authDomain: "cadastersystem.firebaseapp.com",
    projectId: "cadastersystem",
    storageBucket: "cadastersystem.appspot.com",
    messagingSenderId: "59494816570",
    appId: "1:59494816570:web:91cc20f3edb55fd3034e03",
    measurementId: "G-BLTH04DXGP"
};

if (typeof window !== "undefined" && !firebaseClient.apps.length) {
    firebaseClient.initializeApp(CLIENT_CONFIG);
    firebaseClient
        .auth()
        .setPersistence(firebaseClient.auth.Auth.Persistence.SESSION);
    (window as any).firebase = firebaseClient;
}

export { firebaseClient };
export default firebase