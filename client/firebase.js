import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBa_CYad30VAfsGrOEaKIaoUdQTHfyGRkU",
  authDomain: "bookingapp-5d5e9.firebaseapp.com",
  projectId: "bookingapp-5d5e9",
  storageBucket: "bookingapp-5d5e9.appspot.com",
  messagingSenderId: "1026376914053",
  appId: "1:1026376914053:web:4e64308982c5e0000485ec"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, app as default };