// ============================================
// Firebase Configuration — SchemeConnect
// ============================================

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAALqRKxqzRTyn03OzTdv-iIX7B4PcsoUo",
  authDomain: "schemeconnect-1b991.firebaseapp.com",
  projectId: "schemeconnect-1b991",
  storageBucket: "schemeconnect-1b991.firebasestorage.app",
  messagingSenderId: "754489262062",
  appId: "1:754489262062:web:48569901a9c742ea5d18ff",
  measurementId: "G-2V2TJVD7VT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth (needed for Phone OTP)
export const auth = getAuth(app);
export default app;
