import app from 'firebase/app';
import 'firebase/firestore';
import "firebase/auth";

const config = {
	apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
	authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
	storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.REACT_APP_FIREBASE_APP_ID,
	measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const firebaseApp = app.initializeApp(config);
const db = app.firestore();
const auth = firebaseApp.auth();

export {app, auth, db};
export default firebaseApp;


// import app from 'firebase/compat/app';
// import 'firebase/compat/firestore';
// import "firebase/compat/auth";

// const config = {
// 	apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
// 	authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
// 	projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
// 	storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
// 	messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
// 	appId: process.env.REACT_APP_FIREBASE_APP_ID,
// 	measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
// };

// const firebaseApp = app.initializeApp(config);
// const db = app.firestore();
// const auth = firebaseApp.auth();
// const provider = new app.auth.GoogleAuthProvider();

// export {app, auth, db, provider};
// export default firebaseApp;

