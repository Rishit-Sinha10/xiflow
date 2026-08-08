import "dotenv/config";
import { cert, initializeApp, deleteApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
const app = initializeApp({ credential: cert({ projectId: process.env.FIREBASE_PROJECT_ID, clientEmail: process.env.FIREBASE_CLIENT_EMAIL, privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n") }) });
const db = getFirestore(app);
const snap = await db.collection("players").get();
const roles = {};
const samples = [];
for (const d of snap.docs) {
  const p = d.data();
  const k = `${p.role}/${p.position}`;
  roles[k] = (roles[k] || 0) + 1;
  if (p.role === "G") samples.push(p.name);
}
console.log("counts:", JSON.stringify(roles));
console.log("GKs:", samples.join(", "));
await deleteApp(app);
