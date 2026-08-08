import { db } from "../config/firebaseadmin.js";
import { COLLECTIONS } from "../config/constants.js";
import { httpError } from "../utils/formatters.js";

const TIMELINE_DAYS = 14;

function assertDb() {
  if (!db) throw httpError("Stats database not available", 503);
}

function lineupsRef(uid) {
  return db.collection(COLLECTIONS.users).doc(uid).collection(COLLECTIONS.lineups);
}

function teamsRef(uid) {
  return db.collection(COLLECTIONS.users).doc(uid).collection(COLLECTIONS.teams);
}

function toISO(t) {
  return t?.toDate?.()?.toISOString() ?? null;
}

function dayKey(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

function dayLabel(key) {
  const [, m, d] = key.split("-");
  return `${Number(m)}/${Number(d)}`;
}

function buildTimeline(dates) {
  const days = [];
  const now = new Date();
  for (let i = TIMELINE_DAYS - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const key = dayKey(d);
    days.push({ day: dayLabel(key), created: 0 });
  }
  const index = new Map(days.map((d, i) => [dayKey(new Date()), i]));
  for (const iso of dates) {
    const key = dayKey(new Date(iso));
    if (index.has(key)) days[index.get(key)].created += 1;
  }
  return days;
}

export class StatsService {
  async overview(uid) {
    assertDb();
    const [lineupSnap, teamSnap, shareSnap] = await Promise.all([
      lineupsRef(uid).get(),
      teamsRef(uid).get(),
      db.collection(COLLECTIONS.sharing).where("createdBy", "==", uid).get(),
    ]);

    const lineupDocs = lineupSnap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      createdAt: toISO(d.data().createdAt),
      updatedAt: toISO(d.data().updatedAt),
    }));
    const teamDocs = teamSnap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      createdAt: toISO(d.data().createdAt),
    }));
    const shareDocs = shareSnap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      createdAt: toISO(d.data().createdAt),
      expiresAt: toISO(d.data().expiresAt),
    }));

    const formationUsage = {};
    for (const l of lineupDocs) {
      const f = l.formation || "4-3-3";
      formationUsage[f] = (formationUsage[f] || 0) + 1;
    }
    const formations = Object.entries(formationUsage)
      .map(([id, count]) => ({ id, count }))
      .sort((a, b) => b.count - a.count);

    const playerCounts = new Map();
    const playerInfo = new Map();
    for (const l of lineupDocs) {
      for (const p of Object.values(l.players || {})) {
        if (!p || !p.id) continue;
        playerCounts.set(p.id, (playerCounts.get(p.id) || 0) + 1);
        if (!playerInfo.has(p.id)) {
          playerInfo.set(p.id, {
            id: p.id,
            name: p.name,
            position: p.position,
            role: p.role,
            photoUrl: p.photoUrl,
          });
        }
      }
    }
    const topPlayers = [...playerCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, count]) => ({
        ...playerInfo.get(id),
        appearances: count,
        lineups: lineupDocs.length,
      }));

    const now = Date.now();
    let totalViews = 0;
    let activeShares = 0;
    for (const s of shareDocs) {
      totalViews += s.views || 0;
      const notExpired = !s.expiresAt || new Date(s.expiresAt).getTime() > now;
      const underLimit =
        s.maxViews === null || s.maxViews === undefined || (s.views || 0) < s.maxViews;
      if (notExpired && underLimit) activeShares += 1;
    }

    const createdDates = [
      ...lineupDocs.map((l) => l.createdAt),
      ...teamDocs.map((t) => t.createdAt),
    ].filter(Boolean);

    const membersCount = teamDocs.reduce((sum, t) => sum + (t.members?.length || 0), 0);

    return {
      lineups: {
        total: lineupDocs.length,
        withTeam: lineupDocs.filter((l) => l.teamId).length,
      },
      teams: {
        total: teamDocs.length,
        members: membersCount,
      },
      formations: {
        usage: formations,
        mostUsed: formations[0]?.id || null,
        mostUsedCount: formations[0]?.count || 0,
      },
      players: {
        totalUnique: playerCounts.size,
        top: topPlayers,
      },
      sharing: {
        total: shareDocs.length,
        active: activeShares,
        totalViews,
        averageViews: shareDocs.length
          ? Math.round((totalViews / shareDocs.length) * 10) / 10
          : 0,
      },
      timeline: buildTimeline(createdDates),
    };
  }
}

export const statsService = new StatsService();
