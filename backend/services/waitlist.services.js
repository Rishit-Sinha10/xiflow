import { db } from "../config/firebaseadmin.js";
import { COLLECTIONS } from "../config/constants.js";
import { httpError } from "../utils/formatters.js";

function assertDb() {
  if (!db) {
    throw httpError("Waitlist database not available", 503);
  }
}

function serialize(snapshot) {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    ...data,
    createdAt: data.createdAt?.toDate?.()?.toISOString() ?? null,
  };
}

export class WaitlistService {
  async join({ email, name = "" }) {
    assertDb();
    const normalized = String(email).trim().toLowerCase();
    const existing = await db
      .collection(COLLECTIONS.waitlist)
      .where("email", "==", normalized)
      .limit(1)
      .get();
    if (!existing.empty) {
      return { entry: serialize(existing.docs[0]), alreadyJoined: true };
    }
    const ref = db.collection(COLLECTIONS.waitlist).doc();
    const doc = {
      email: normalized,
      name: name.trim() || null,
      source: "landing",
      status: "pending",
      createdAt: new Date(),
    };
    await ref.set(doc);
    return { entry: serialize(await ref.get()), alreadyJoined: false };
  }

  async list(limit = 200) {
    assertDb();
    const snap = await db
      .collection(COLLECTIONS.waitlist)
      .orderBy("createdAt", "desc")
      .limit(Math.min(Number(limit) || 200, 500))
      .get();
    return snap.docs.map(serialize);
  }
}

export const waitlistService = new WaitlistService();
