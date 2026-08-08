import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { FIREBASE } from "./constants.js";

const privateKeyOk = FIREBASE.privateKey?.includes("PRIVATE KEY-----");
const hasCredentials = FIREBASE.projectId && FIREBASE.clientEmail && privateKeyOk;

let adminApp = null;

if (hasCredentials) {
  const existing = getApps().find((app) => app.name === "[DEFAULT]");
  adminApp =
    existing ??
    initializeApp({
      credential: cert({
        projectId: FIREBASE.projectId,
        clientEmail: FIREBASE.clientEmail,
        privateKey: FIREBASE.privateKey,
      }),
    });
}

const auth = adminApp ? getAuth(adminApp) : null;
const db = adminApp ? getFirestore(adminApp) : null;

export { adminApp, auth, db };
export { hasCredentials };
