import "dotenv/config";

export const PORT = Number(process.env.PORT) || 5000;
export const NODE_ENV = process.env.NODE_ENV || "development";
export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

export const FIREBASE = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

export const JWT = {
  secret: process.env.JWT_SECRET || "dev-secret-change-me",
  expiresIn: process.env.JWT_EXPIRY || "15m",
};

export const COLLECTIONS = {
  users: "users",
  teams: "teams",
  lineups: "lineups",
  formations: "formations",
  sharing: "sharing",
  players: "players",
};
