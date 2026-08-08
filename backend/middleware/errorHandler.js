export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  const status = err.status || err.statusCode || 500;
  const message =
    status >= 500 ? "Internal server error" : err.message || "Request failed";

  if (status >= 500) console.error(err);

  return res.status(status).json({ success: false, error: message });
}

export function notFound(req, res) {
  return res.status(404).json({ success: false, error: "Route not found" });
}
