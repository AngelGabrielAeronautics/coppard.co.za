import { initializeApp, getApps } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { getAuth } from "firebase/auth"
import { getAnalytics } from "firebase/analytics"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCQGWNL6VsqtElEL_pjBtLchl4jzFxAfyU",
  authDomain: "dcoppard-art.firebaseapp.com",
  projectId: "dcoppard-art",
  storageBucket: "dcoppard-art.firebasestorage.app", // This should be "dcoppard-art.appspot.com"
  messagingSenderId: "897852681988",
  appId: "1:897852681988:web:52f9829c26868c41616a51",
  measurementId: "G-JKY6C37EDD",
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

// Initialize Firestore without persistence for now to avoid errors
const db = getFirestore(app)
const storage = getStorage(app)
const auth = getAuth(app)

// Initialize Analytics only on client side
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null

export { app, db, storage, auth, analytics }

