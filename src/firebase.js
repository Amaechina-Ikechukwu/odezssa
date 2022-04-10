// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCo78KCs1zV7tt6E5Dn5JzhX5FkbjnMPFo",
  authDomain: "odezssa.firebaseapp.com",
  projectId: "odezssa",
  storageBucket: "odezssa.appspot.com",
  messagingSenderId: "535185765117",
  appId: "1:535185765117:web:c515bf3ad7606a91df4494",
};
// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_API_KEY,
//   authDomain: process.env.REACT_APP_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_MESS_ID,
//   appId: process.env.REACT_APP_APP_ID,
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export { app };
