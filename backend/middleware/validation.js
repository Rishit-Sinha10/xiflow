import { ZodError } from "zod";
export function validate(schema, source = "body") {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req[source]);
      if (source === "body") {
        req.body = parsed;
      } else {
        req.validated = req.validated || {};
        req.validated[source] = parsed;
      }
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const issues = err.issues || err.errors || [];
        return res.status(400).json({
          success: false,
          error: "Validation failed",
          details: issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
      }
      next(err);
    }
  };
}
