import jwt from "jsonwebtoken";
import { auth, db } from "../config/firebaseadmin.js";
import { JWT, COLLECTIONS } from "../config/constants.js";

export function signToken(uid, extra = {}) {
  return jwt.sign({ uid, ...extra }, JWT.secret, { expiresIn: JWT.expiresIn });
}

export async function verifyAppToken(token) {
  const payload = jwt.verify(token, JWT.secret);
  if (!payload?.uid) throw new Error("Invalid token payload");
  return payload;
}

export async function verifyFirebaseIdToken(idToken) {
  if (!auth) throw new Error("Firebase admin is not configured");
  return auth.verifyIdToken(idToken);
}

export async function verifyToken(token) {
  try {
    return { kind: "app", payload: await verifyAppToken(token) };
  } catch {
    const decoded = await verifyFirebaseIdToken(token);
    return { kind: "firebase", payload: { uid: decoded.uid, ...decoded } };
  }
}

export async function upsertUser(firebaseUser) {
  if (!db) throw new Error("Firebase admin is not configured");
  const ref = db.collection(COLLECTIONS.users).doc(firebaseUser.uid);
  const doc = await ref.get();
  if (doc.exists) {
    const existing = doc.data();
    const updates = {
      email: firebaseUser.email ?? existing.email,
      updatedAt: new Date(),
    };
    if (firebaseUser.displayName) updates.displayName = firebaseUser.displayName;
    await ref.update(updates);
    return { ...existing, ...updates };
  }
  const profile = {
    uid: firebaseUser.uid,
    email: firebaseUser.email ?? null,
    displayName: firebaseUser.displayName ?? firebaseUser.email?.split("@")[0] ?? "",
    profileImage: null,
    preferences: { theme: "dark", defaultFormation: "4-3-3", notifications: true },
    stats: { totalLineups: 0, totalTeams: 0, lineupsShared: 0 },
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  await ref.set(profile);
  return profile;
}

export async function getUserProfile(uid) {
  if (!db) throw new Error("Firebase admin is not configured");
  const doc = await db.collection(COLLECTIONS.users).doc(uid).get();
  return doc.exists ? doc.data() : null;
}

export async function updateUserProfile(uid, updates) {
  if (!db) throw new Error("Firebase admin is not configured");
  const ref = db.collection(COLLECTIONS.users).doc(uid);
  const doc = await ref.get();
  if (!doc.exists) return null;
  const data = doc.data();
  const next = {
    ...data,
    ...(updates.displayName !== undefined
      ? { displayName: updates.displayName }
      : {}),
    preferences: {
      ...(data.preferences || {}),
      ...(updates.preferences || {}),
    },
    updatedAt: new Date(),
  };
  await ref.set(next, { merge: true });
  return next;
}
