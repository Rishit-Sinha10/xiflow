import { auth as adminAuth } from "../config/firebaseadmin.js";
import {
  signToken,
  verifyFirebaseIdToken,
  verifyAppToken,
  upsertUser,
  getUserProfile,
  updateUserProfile,
} from "../services/auth.services.js";
import { ok, fail, sanitizeUser } from "../utils/formatters.js";

export async function register(req, res) {
  try {
    if (!adminAuth) return fail(res, "Firebase admin is not configured", 503);
    const { email, password, name } = req.body;
    const firebaseUser = await adminAuth.createUser({ email, password, displayName: name });
    const profile = await upsertUser({
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: name,
    });
    const token = signToken(firebaseUser.uid, { email: firebaseUser.email });
    return ok(res, { token, user: sanitizeUser(profile) }, 201);
  } catch (err) {
    if (err.code === "auth/email-already-exists") {
      return fail(res, "An account with this email already exists", 409);
    }
    if (err.code === "auth/invalid-password") {
      return fail(res, "Password must be at least 6 characters", 400);
    }
    throw err;
  }
}

export async function login(req, res) {
  const { idToken } = req.body;
  if (!adminAuth) return fail(res, "Firebase admin is not configured", 503);
  const decoded = await verifyFirebaseIdToken(idToken);
  const profile = await upsertUser({
    uid: decoded.uid,
    email: decoded.email || decoded.firebase?.email,
    displayName: decoded.name,
  });
  const token = signToken(decoded.uid, { email: profile.email });
  return ok(res, { token, user: sanitizeUser(profile) });
}

export async function verifyToken(req, res) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return fail(res, "Missing authorization token", 401);
  try {
    const { payload } = await verifyAppToken(token);
    const profile = await getUserProfile(payload.uid);
    if (!profile) return fail(res, "User not found", 404);
    return ok(res, { user: sanitizeUser(profile) });
  } catch (err) {
    return fail(res, "Invalid or expired token", 401);
  }
}

export async function refreshToken(req, res) {
  const { token } = req.body;
  try {
    const payload = await verifyAppToken(token);
    const refreshed = signToken(payload.uid, { email: payload.email });
    return ok(res, { token: refreshed });
  } catch (err) {
    return fail(res, "Invalid or expired token", 401);
  }
}

export async function getUserProfileHandler(req, res) {
  const profile = await getUserProfile(req.user.uid);
  if (!profile) return fail(res, "User not found", 404);
  return ok(res, { user: sanitizeUser(profile) });
}

export async function updateProfile(req, res) {
  const profile = await updateUserProfile(req.user.uid, req.body);
  if (!profile) return fail(res, "User not found", 404);
  return ok(res, { user: sanitizeUser(profile) });
}
