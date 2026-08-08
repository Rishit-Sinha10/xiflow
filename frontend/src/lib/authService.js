const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(body.error || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return body.data;
}

export const authService = {
  exchangeIdToken: (idToken) =>
    request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ idToken }),
    }),

  refresh: (token) =>
    request("/api/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ token }),
    }),

  getProfile: (token) =>
    request("/api/auth/user", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  updateProfile: (token, updates) =>
    request("/api/auth/user", {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(updates),
    }),
};
