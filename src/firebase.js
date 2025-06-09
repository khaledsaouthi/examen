import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAtifM-67J2k3v1bG98onxLvd8bgflsA3Q",
  authDomain: "examen-fc768.firebaseapp.com",
  projectId: "examen-fc768",
  storageBucket: "examen-fc768.firebasestorage.app",
  messagingSenderId: "712504490692",
  appId: "1:712504490692:web:c954c01448e4d728fde791",
  measurementId: "G-EQQ7TPL8ES"
};


export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
