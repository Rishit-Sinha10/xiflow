import { sharingService } from "../services/sharing.services.js";
import { ok, fail } from "../utils/formatters.js";
export async function createShareLink(req, res) {
  const share = await sharingService.create(
    req.user.uid,
    req.validated.params.id,
    req.body,
  );
  return ok(res, { share }, 201);
}
export async function getSharedLineup(req, res) {
  const result = await sharingService.getByAccessCode(req.validated.params.accessCode);
  return ok(res, result);
}
export async function deleteShareLink(req, res) {
  const deleted = await sharingService.remove(req.user.uid, req.validated.params.shareId);
  if (!deleted) return fail(res, "Share link not found", 404);
  return ok(res, { deleted: true });
}
export async function getShareStats(req, res) {
  const share = await sharingService.stats(req.user.uid, req.validated.params.shareId);
  if (!share) return fail(res, "Share link not found", 404);
  return ok(res, { share });
}