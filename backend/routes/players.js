import { Router } from "express";
import {
  listPlayers,
  getPlayer,
  searchPlayers,
  getPlayersByPosition,
} from "../controllers/player.controller.js";
import { validate } from "../middleware/validation.js";
import {
  listPlayersQuery,
  searchPlayersQuery,
  playerParams,
  positionParams,
} from "../utils/validators.js";

const router = Router();

router.get("/search", validate(searchPlayersQuery, "query"), searchPlayers);
router.get("/position/:pos", validate(positionParams, "params"), getPlayersByPosition);
router.get("/", validate(listPlayersQuery, "query"), listPlayers);
router.get("/:id", validate(playerParams, "params"), getPlayer);

export default router;
