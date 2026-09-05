/* =====================================================================
   CONFIGURAÇÃO DO FIREBASE — Doces do Léo
   ===================================================================== */

const firebaseConfig = {
  apiKey: "AIzaSyCxhcCuWgmslHeJUpvBSdXnLhhn4gr1ZbU",
  authDomain: "leo-confeitaria.firebaseapp.com",
  projectId: "leo-confeitaria",
  storageBucket: "leo-confeitaria.firebasestorage.app",
  messagingSenderId: "861435291044",
  appId: "1:861435291044:web:5e22d5ade1044fa0150d31"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
// "auth" só existe nas páginas que também carregam o firebase-auth-compat.js (o painel).
const auth = (typeof firebase.auth === 'function') ? firebase.auth() : null;
