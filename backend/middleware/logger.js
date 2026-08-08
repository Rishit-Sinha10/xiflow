import { NODE_ENV } from "../config/constants.js";

export function logger(req, res, next) {
  const start = Date.now();
  res.on("finish", () => {
    if (NODE_ENV === "test") return;
    const ms = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms`);
  });
  next();
}
