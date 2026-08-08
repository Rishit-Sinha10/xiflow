import { db } from "../config/firebaseadmin.js";
import { COLLECTIONS } from "../config/constants.js";
import { httpError } from "../utils/formatters.js";

function assertDb() {
  if (!db) {
    throw httpError("Team database not available", 503);
  }
}

function teamsRef(uid) {
  return db.collection(COLLECTIONS.users).doc(uid).collection(COLLECTIONS.teams);
}

function serialize(snapshot) {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    ...data,
    createdAt: data.createdAt?.toDate?.()?.toISOString() ?? null,
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() ?? null,
  };
}

export class TeamService {
  async list(uid) {
    assertDb();
    const snap = await teamsRef(uid).orderBy("updatedAt", "desc").get();
    return snap.docs.map(serialize);
  }

  async get(uid, id) {
    assertDb();
    const doc = await teamsRef(uid).doc(String(id)).get();
    return doc.exists ? serialize(doc) : null;
  }

  async create(uid, data) {
    assertDb();
    const ref = teamsRef(uid).doc();
    const doc = {
      name: (data.name || "").trim(),
      badge: (data.badge || "").trim(),
      shortName: (data.shortName || "").trim(),
      league: (data.league || "").trim(),
      country: (data.country || "").trim(),
      founded: data.founded ? Number(data.founded) : null,
      color: data.color || "#059669",
      members: data.members || [uid],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await ref.set(doc);
    return serialize(await ref.get());
  }

  async update(uid, id, updates) {
    assertDb();
    const ref = teamsRef(uid).doc(String(id));
    const existing = await ref.get();
    if (!existing.exists) return null;
    const data = existing.data();
    const next = { ...data, updatedAt: new Date() };
    if (updates.name !== undefined) next.name = String(updates.name).trim();
    if (updates.badge !== undefined) next.badge = String(updates.badge).trim();
    if (updates.shortName !== undefined) next.shortName = String(updates.shortName).trim();
    if (updates.league !== undefined) next.league = String(updates.league).trim();
    if (updates.country !== undefined) next.country = String(updates.country).trim();
    if (updates.founded !== undefined) next.founded = updates.founded ? Number(updates.founded) : null;
    if (updates.color !== undefined) next.color = updates.color;
    await ref.set(next, { merge: true });
    return serialize(await ref.get());
  }

  async remove(uid, id) {
    assertDb();
    const ref = teamsRef(uid).doc(String(id));
    const existing = await ref.get();
    if (!existing.exists) return false;
    await ref.delete();
    return true;
  }

  async addMember(uid, id, memberUid) {
    assertDb();
    const ref = teamsRef(uid).doc(String(id));
    const existing = await ref.get();
    if (!existing.exists) return null;
    const members = existing.data().members || [];
    if (!members.includes(memberUid)) {
      members.push(memberUid);
      await ref.update({ members, updatedAt: new Date() });
    }
    return serialize(await ref.get());
  }

  async removeMember(uid, id, memberUid) {
    assertDb();
    const ref = teamsRef(uid).doc(String(id));
    const existing = await ref.get();
    if (!existing.exists) return null;
    if (existing.data().members?.length === 1) {
      throw httpError("A team must have at least one member", 400);
    }
    const members = (existing.data().members || []).filter((m) => m !== memberUid);
    await ref.update({ members, updatedAt: new Date() });
    return serialize(await ref.get());
  }
}

export const teamService = new TeamService();
