import crypto from "node:crypto";
import { db } from "../config/firebaseadmin.js";
import { COLLECTIONS } from "../config/constants.js";
import { httpError } from "../utils/formatters.js";
const ACCESS_CODE_LENGTH = 8;
const DEFAULT_EXPIRY_DAYS = 7;
function assertDb() {
  if (!db) {
    throw httpError("Sharing database not available", 503);
  }
}
function serialize(snapshot) {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    ...data,
    createdAt: data.createdAt?.toDate?.()?.toISOString() ?? null,
    expiresAt: data.expiresAt?.toDate?.()?.toISOString() ?? null,
  };
}
function generateAccessCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < ACCESS_CODE_LENGTH; i++) {
    code += alphabet[crypto.randomInt(alphabet.length)];
  }
  return code;
}
export class SharingService {
  async create(uid, lineupId, options = {}) {
    assertDb();
    const lineupDoc = await db
      .collection(COLLECTIONS.users)
      .doc(uid)
      .collection(COLLECTIONS.lineups)
      .doc(String(lineupId))
      .get();
    if (!lineupDoc.exists) throw httpError("Lineup not found", 404);
    const maxViews = options.maxViews ? Number(options.maxViews) : null;
    const expiryDays =
      options.expiresInDays !== undefined && options.expiresInDays !== null
        ? Number(options.expiresInDays)
        : DEFAULT_EXPIRY_DAYS;
    let accessCode = generateAccessCode();
    for (let attempt = 0; attempt < 5; attempt++) {
      const existing = await db
        .collection(COLLECTIONS.sharing)
        .where("accessCode", "==", accessCode)
        .get();
      if (existing.empty) break;
      accessCode = generateAccessCode();
    }
    const ref = db.collection(COLLECTIONS.sharing).doc();
    const doc = {
      lineupId: String(lineupId),
      createdBy: uid,
      accessCode,
      views: 0,
      maxViews,
      createdAt: new Date(),
      expiresAt:
        expiryDays > 0
          ? new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000)
          : null,
    };
    await ref.set(doc);
    return serialize(await ref.get());
  }
  async getByAccessCode(accessCode) {
    assertDb();
    const snap = await db
      .collection(COLLECTIONS.sharing)
      .where("accessCode", "==", String(accessCode).toUpperCase())
      .limit(1)
      .get();
    if (snap.empty) throw httpError("Share link not found", 404);
    const share = serialize(snap.docs[0]);
    if (share.expiresAt && new Date(share.expiresAt).getTime() < Date.now()) {
      throw httpError("Share link has expired", 410);
    }
    if (share.maxViews !== null && share.views >= share.maxViews) {
      throw httpError("Share link has reached its view limit", 410);
    }
    const lineupDoc = await db
      .collection(COLLECTIONS.users)
      .doc(share.createdBy)
      .collection(COLLECTIONS.lineups)
      .doc(share.lineupId)
      .get();
    if (!lineupDoc.exists) throw httpError("Lineup not found", 404);
    await snap.docs[0].ref.update({ views: share.views + 1 });
    const lineupData = lineupDoc.data();
    let team = null;
    if (lineupData.teamId) {
      const teamDoc = await db
        .collection(COLLECTIONS.users)
        .doc(share.createdBy)
        .collection(COLLECTIONS.teams)
        .doc(String(lineupData.teamId))
        .get();
      if (teamDoc.exists) {
        const teamData = teamDoc.data();
        team = {
          id: teamDoc.id,
          ...teamData,
          createdAt: teamData.createdAt?.toDate?.()?.toISOString() ?? null,
          updatedAt: teamData.updatedAt?.toDate?.()?.toISOString() ?? null,
        };
      }
    }
    return {
      share: {
        ...share,
        views: share.views + 1,
      },
      lineup: {
        id: lineupDoc.id,
        ...lineupData,
        createdAt: lineupData.createdAt?.toDate?.()?.toISOString() ?? null,
        updatedAt: lineupData.updatedAt?.toDate?.()?.toISOString() ?? null,
      },
      team,
    };
  }
  async remove(uid, shareId) {
    assertDb();
    const doc = await db.collection(COLLECTIONS.sharing).doc(String(shareId)).get();
    if (!doc.exists) return false;
    if (doc.data().createdBy !== uid) {
      throw httpError("You are not the owner of this share link", 403);
    }
    await doc.ref.delete();
    return true;
  }
  async stats(uid, shareId) {
    assertDb();
    const doc = await db.collection(COLLECTIONS.sharing).doc(String(shareId)).get();
    if (!doc.exists) return null;
    if (doc.data().createdBy !== uid) {
      throw httpError("You are not the owner of this share link", 403);
    }
    return serialize(doc);
  }
}
export const sharingService = new SharingService();