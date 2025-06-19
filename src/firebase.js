import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDpwKGfpLnbltCpWWhoafGM0bGCyhfxRn8",
  authDomain: "fuel-station-app-1.firebaseapp.com",
  projectId: "fuel-station-app-1",
  storageBucket: "fuel-station-app-1.appspot.com",
  messagingSenderId: "174081497829",
  appId: "1:174081497829:web:383566c19a0d6a1781d20c",
  measurementId: "G-LKPSGRYBQ5"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

