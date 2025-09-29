// Firebase v10+ (modular)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js'
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut as fbSignOut } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js'
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js'


// --- Config fournie par vous ---
export const firebaseConfig = {
apiKey: "AIzaSyDEVzQfz8loSf2HDzU_YcBvIgH1Fx9_fnw",
authDomain: "dashboard-v4-2ef47.firebaseapp.com",
projectId: "dashboard-v4-2ef47",
storageBucket: "dashboard-v4-2ef47.firebasestorage.app",
messagingSenderId: "179267988381",
appId: "1:179267988381:web:644c3a2dc713ed9bca1d74"
}


export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const provider = new GoogleAuthProvider()


export { onAuthStateChanged, signInWithPopup }
export const signOut = () => fbSignOut(auth)