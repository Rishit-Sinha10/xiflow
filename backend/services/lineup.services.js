import { db } from "../config/firebaseadmin.js";
import { COLLECTIONS } from "../config/constants.js";
import { httpError } from "../utils/formatters.js";

function assertDb() {
  if (!db) {
    throw httpError("Lineup database not available", 503);
  }
}

function lineupsRef(uid) {
  return db.collection(COLLECTIONS.users).doc(uid).collection(COLLECTIONS.lineups);
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

function computeStats(players = {}) {
  const list = Object.values(players || {});
  const rated = list.filter((p) => typeof p.rating === "number");
  const aged = list.filter((p) => typeof p.age === "number");

  const avgRating = rated.length
    ? Math.round((rated.reduce((s, p) => s + p.rating, 0) / rated.length) * 10) / 10
    : 0;
  const avgAge = aged.length
    ? Math.round((aged.reduce((s, p) => s + p.age, 0) / aged.length) * 10) / 10
    : null;

  let formationStrength = "Rebuilding";
  if (avgRating >= 85) formationStrength = "Elite";
  else if (avgRating >= 80) formationStrength = "Strong";
  else if (avgRating >= 75) formationStrength = "Solid";
  else if (avgRating >= 70) formationStrength = "Developing";

  const positionDistribution = {};
  for (const p of list) {
    const pos = (p.position || "Unknown").toUpperCase();
    positionDistribution[pos] = (positionDistribution[pos] || 0) + 1;
  }

  return {
    totalRating: avgRating,
    averageAge: avgAge,
    totalPlayers: list.length,
    formationStrength,
    positionDistribution,
  };
}

export class LineupService {
  async list(uid) {
    assertDb();
    const snap = await lineupsRef(uid).orderBy("updatedAt", "desc").get();
    return snap.docs.map(serialize);
  }

  async get(uid, id) {
    assertDb();
    const doc = await lineupsRef(uid).doc(String(id)).get();
    return doc.exists ? serialize(doc) : null;
  }

  async create(uid, data) {
    assertDb();
    const ref = lineupsRef(uid).doc();
    const doc = {
      name: (data.name || "Untitled lineup").trim(),
      formation: data.formation || "4-3-3",
      teamId: data.teamId || null,
      players: data.players || {},
      stats: computeStats(data.players),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await ref.set(doc);
    return serialize(await ref.get());
  }

  async update(uid, id, updates) {
    assertDb();
    const ref = lineupsRef(uid).doc(String(id));
    const existing = await ref.get();
    if (!existing.exists) return null;
    const data = existing.data();
    const next = { ...data, updatedAt: new Date() };
    if (updates.name !== undefined) next.name = String(updates.name).trim();
    if (updates.formation !== undefined) next.formation = updates.formation;
    if (updates.teamId !== undefined) next.teamId = updates.teamId || null;
    if (updates.players !== undefined) {
      next.players = updates.players;
      next.stats = computeStats(updates.players);
    }
    await ref.set(next, { merge: true });
    return serialize(await ref.get());
  }

  async remove(uid, id) {
    assertDb();
    const ref = lineupsRef(uid).doc(String(id));
    const existing = await ref.get();
    if (!existing.exists) return false;
    await ref.delete();
    return true;
  }

  async duplicate(uid, id) {
    assertDb();
    const original = await this.get(uid, id);
    if (!original) return null;
    const copy = {
      name: `${original.name || "Lineup"} (copy)`,
      formation: original.formation || "4-3-3",
      teamId: original.teamId || null,
      players: original.players || {},
    };
    return this.create(uid, copy);
  }

  async stats(uid, id) {
    assertDb();
    const lineup = await this.get(uid, id);
    if (!lineup) return null;
    return lineup.stats || computeStats(lineup.players);
  }
}

export const lineupService = new LineupService();
