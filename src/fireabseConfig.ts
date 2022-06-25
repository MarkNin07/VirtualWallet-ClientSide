import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBgnq5ZLx_eoB1_f0-ZDhHkiNq6Bdi0Nag",
    authDomain: "virtual-wallet-5d9f8.firebaseapp.com",
    projectId: "virtual-wallet-5d9f8",
    storageBucket: "virtual-wallet-5d9f8.appspot.com",
    messagingSenderId: "553983641071",
    appId: "1:553983641071:web:51331accd005039d59621a"
  };

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();