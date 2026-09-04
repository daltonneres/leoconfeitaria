/* =====================================================================
   CONFIGURAÇÃO DO FIREBASE — Doces do Léo
   ===================================================================== */

const firebaseConfig = {
   apiKey: "AIzaSyAXGjtZlIsdM-0ZpJP2bstjSKsJN5Lh3Zw",
   authDomain: "doces-do-leo.firebaseapp.com",
   projectId: "doces-do-leo",
   storageBucket: "doces-do-leo.firebasestorage.app",
   messagingSenderId: "246778473889",
   appId: "1:246778473889:web:679688a9909ca75ca1afe0"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

// "auth" só existe nas páginas que também carregam o firebase-auth-compat.js
const auth = (typeof firebase.auth === 'function')
   ? firebase.auth()
   : null;