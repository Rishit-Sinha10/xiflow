import { db } from "../config/firebaseadmin.js";
import { COLLECTIONS } from "../config/constants.js";
import { httpError } from "../utils/formatters.js";

const SORT_OPTIONS = {
  rating: { field: "rating", dir: "desc" },
  name: { field: "name", dir: "asc" },
  age: { field: "age", dir: "asc" },
  value: { field: "valueEuro", dir: "desc" },
};

const ROLE_CODES = ["G", "D", "M", "F"];

function assertDb() {
  if (!db) {
    throw httpError("Player database not available", 503);
  }
}

function sortInMemory(players, sort) {
  const opt = SORT_OPTIONS[sort] || SORT_OPTIONS.rating;
  const { field, dir } = opt;
  const dirFactor = dir === "desc" ? -1 : 1;
  return [...players].sort((a, b) => {
    const av = a[field];
    const bv = b[field];
    if (typeof av === "string" && typeof bv === "string") {
      return av.localeCompare(bv) * dirFactor;
    }
    return ((av ?? 0) - (bv ?? 0)) * dirFactor;
  });
}

function tokenize(query) {
  return String(query)
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .slice(0, 10);
}

export class PlayerService {
  async list({ q, position, nationality, sort, limit = 50, page = 1 } = {}) {
    assertDb();

    const safeLimit = Math.min(Math.max(limit, 1), 500);
    const safePage = Math.max(page, 1);
    const collection = db.collection(COLLECTIONS.players);

    if (q && String(q).trim()) {
      return this.search(String(q).trim(), { limit: safeLimit });
    }

    let query = collection;

    if (position && String(position).trim()) {
      const wanted = String(position).trim().toUpperCase();
      query = ROLE_CODES.includes(wanted)
        ? query.where("role", "==", wanted)
        : query.where("positions", "array-contains", wanted);
    }

    if (nationality && String(nationality).trim()) {
      query = query.where("nationality", "==", String(nationality).trim());
    }

    if (!position && !nationality) {
      const opt = SORT_OPTIONS[sort] || SORT_OPTIONS.rating;
      const snap = await query
        .orderBy(opt.field, opt.dir)
        .offset((safePage - 1) * safeLimit)
        .limit(safeLimit)
        .get();
      const players = snap.docs.map((d) => d.data());
      return { players, total: players.length, page: safePage, pages: 1 };
    }

    const snap = await query.get();
    let players = snap.docs.map((d) => d.data());

    if (position && String(position).trim()) {
      const wanted = String(position).trim().toUpperCase();
      players = players.filter(
        (p) =>
          p.role === wanted ||
          p.position === wanted ||
          (Array.isArray(p.positions) && p.positions.some((x) => x.toUpperCase() === wanted)),
      );
    }

    if (nationality && String(nationality).trim()) {
      const target = String(nationality).trim().toLowerCase();
      players = players.filter(
        (p) => (p.nationality || "").toLowerCase() === target,
      );
    }

    players = sortInMemory(players, sort);
    const total = players.length;
    const pages = Math.max(1, Math.ceil(total / safeLimit));
    const start = (safePage - 1) * safeLimit;
    return {
      players: players.slice(start, start + safeLimit),
      total,
      page: safePage,
      pages,
    };
  }

  async search(query, { limit = 50 } = {}) {
    assertDb();
    const q = String(query || "").trim();
    if (q.length < 3) throw httpError("Search query must be at least 3 characters", 400);

    const safeLimit = Math.min(Math.max(limit, 1), 500);
    const tokens = tokenize(q);

    const collection = db.collection(COLLECTIONS.players);
    let snap;
    if (tokens.length > 1) {
      snap = await collection
        .where("searchTokens", "array-contains-any", tokens)
        .limit(safeLimit)
        .get();
    } else {
      snap = await collection
        .where("searchTokens", "array-contains", tokens[0])
        .limit(safeLimit)
        .get();
    }

    let players = snap.docs.map((d) => d.data());
    const needle = q.toLowerCase();
    players = players
      .filter((p) => {
        const hay = `${p.name || ""} ${p.fullName || ""} ${p.nationality || ""}`.toLowerCase();
        return tokens.every((t) => hay.includes(t));
      })
      .sort((a, b) => {
        const aStart = (a.name || "").toLowerCase().startsWith(needle) ? 0 : 1;
        const bStart = (b.name || "").toLowerCase().startsWith(needle) ? 0 : 1;
        if (aStart !== bStart) return aStart - bStart;
        return (b.rating ?? 0) - (a.rating ?? 0);
      });

    return {
      players: players.slice(0, safeLimit),
      total: players.length,
      page: 1,
      pages: 1,
    };
  }

  async getPlayer(id) {
    assertDb();
    const doc = await db.collection(COLLECTIONS.players).doc(String(id)).get();
    return doc.exists ? doc.data() : null;
  }

  async getPlayersByPosition(position, { limit = 500 } = {}) {
    assertDb();
    const wanted = String(position || "").trim().toUpperCase();
    if (!wanted) throw httpError("Position is required", 400);

    const safeLimit = Math.min(Math.max(limit, 1), 500);
    const collection = db.collection(COLLECTIONS.players);

    let snap;
    if (ROLE_CODES.includes(wanted)) {
      snap = await collection.where("role", "==", wanted).limit(safeLimit).get();
    } else {
      snap = await collection
        .where("positions", "array-contains", wanted)
        .limit(safeLimit)
        .get();
    }

    const players = sortInMemory(snap.docs.map((d) => d.data()), "rating");
    return { position: wanted, players };
  }
}

export const playerService = new PlayerService();
