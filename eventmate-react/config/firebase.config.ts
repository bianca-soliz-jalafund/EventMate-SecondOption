import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { getMessaging } from "firebase/messaging";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// Forzar long-polling para evitar errores QUIC/transport en algunas redes/navegadores
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
const storage = getStorage(app);
const functions = getFunctions(app, "us-central1");
// Conectar al emulador de Functions en desarrollo
if (import.meta.env.DEV) {
  try {
    connectFunctionsEmulator(functions, "localhost", 5001);
  } catch (err) {
    console.warn("Functions emulator connection skipped:", err);
  }
}
const messaging = getMessaging(app);
export { app, auth, db, functions, messaging, storage };

