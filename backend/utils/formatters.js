export function ok(res, data = {}, status = 200) {
  return res.status(status).json({ success: true, data });
}

export function fail(res, message, status = 400, details = null) {
  return res.status(status).json({ success: false, error: message, details });
}

export function httpError(message, status = 400) {
  const err = new Error(message);
  err.status = status;
  return err;
}

export function sanitizeUser(user) {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    profileImage: user.profileImage || null,
    preferences: user.preferences || {
      theme: "dark",
      defaultFormation: "4-3-3",
      notifications: true,
    },
    stats: user.stats || {
      totalLineups: 0,
      totalTeams: 0,
      lineupsShared: 0,
    },
    createdAt: user.createdAt ?? null,
    updatedAt: user.updatedAt ?? null,
  };
}
