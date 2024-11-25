import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCoaUpfSsKYBdnjosLT9Zn96KPPsg8Gt_M",
    authDomain: "rbac-5e7e2.firebaseapp.com",
    projectId: "rbac-5e7e2",
    storageBucket: "rbac-5e7e2.firebasestorage.app",
    messagingSenderId: "859941286365",
    appId: "1:859941286365:web:c4f997a93e21268c734634"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
