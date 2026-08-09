import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import playerRoutes from "./routes/players.js";
import lineupRoutes from "./routes/lineup.js";
import teamRoutes from "./routes/teams.js";
import sharingRoutes from "./routes/sharing.js";
import statsRoutes from "./routes/stats.js";
import waitlistRoutes from "./routes/waitlist.js";
import { logger } from "./middleware/logger.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { PORT, FRONTEND_URL } from "./config/constants.js";

export const app = express();

app.use(
  cors({
    origin: FRONTEND_URL.split(",").map((s) => s.trim()),
    credentials: true,
  }),
);
app.use(express.json());
app.use(logger);

app.get("/", (req, res) => {
  res.json({
    success: true,
    name: "xiflow API",
    version: "1.0.0",
    auth: "/api/auth",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/players", playerRoutes);
app.use("/api/lineups", lineupRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/share", sharingRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/waitlist", waitlistRoutes);

app.use(notFound);
app.use(errorHandler);

export { PORT };
