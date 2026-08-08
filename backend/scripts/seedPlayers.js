import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { db, hasCredentials } from "../config/firebaseadmin.js";
import { COLLECTIONS } from "../config/constants.js";
const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = join(__dirname, "..", "data", "fifa_players.csv");
const ROLE_BY_POSITION = {
  GK: "G",
  CB: "D",
  RB: "D",
  LB: "D",
  RWB: "D",
  LWB: "D",
  CDM: "M",
  CM: "M",
  CAM: "M",
  RM: "M",
  LM: "M",
  RW: "M",
  LW: "M",
  ST: "F",
  CF: "F",
  RF: "F",
  LF: "F",
};

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
function toNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}
function tokenize(value) {
  return String(value)
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.some((f) => f.trim() !== "")) rows.push(row);
      row = [];
    } else {
      field += ch;
    }
  }
  if (field !== "" || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function mapPlayer(row, col, idCounts) {
  const get = (name) => {
    const index = col[name];
    return index === undefined ? null : row[index] ?? null;
  };

  const name = (get("name") || "Unknown").trim();
  const positions = (get("positions") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const primary = positions[0] || "Unknown";
  const role = ROLE_BY_POSITION[primary] || "Unknown";

  let base = slugify(name) || "player";
  let id = base;
  const count = idCounts.get(base) || 0;
  if (count > 0) id = `${base}-${count + 1}`;
  idCounts.set(base, count + 1);

  return {
    id,
    name,
    searchTokens: tokenize(`${name} ${get("full_name") || ""} ${get("nationality") || ""}`),
    fullName: get("full_name") || name,
    birthDate: get("birth_date") || null,
    age: toNumber(get("age")),
    heightCm: toNumber(get("height_cm")),
    weightKgs: toNumber(get("weight_kgs")),
    positions,
    position: primary,
    role,
    nationality: get("nationality") || null,
    rating: toNumber(get("overall_rating")),
    potential: toNumber(get("potential")),
    valueEuro: toNumber(get("value_euro")),
    wageEuro: toNumber(get("wage_euro")),
    preferredFoot: get("preferred_foot") || null,
    internationalReputation: toNumber(get("international_reputation(1-5)")),
    weakFoot: toNumber(get("weak_foot(1-5)")),
    skillMoves: toNumber(get("skill_moves(1-5)")),
    bodyType: get("body_type") || null,
    releaseClauseEuro: toNumber(get("release_clause_euro")),
    nationalTeam: get("national_team") || null,
    nationalRating: toNumber(get("national_rating")),
    nationalTeamPosition: get("national_team_position") || null,
    nationalJerseyNumber: toNumber(get("national_jersey_number")),
    photoUrl: null,
    attributes: {
      crossing: toNumber(get("crossing")),
      finishing: toNumber(get("finishing")),
      headingAccuracy: toNumber(get("heading_accuracy")),
      shortPassing: toNumber(get("short_passing")),
      volleys: toNumber(get("volleys")),
      dribbling: toNumber(get("dribbling")),
      curve: toNumber(get("curve")),
      freekickAccuracy: toNumber(get("freekick_accuracy")),
      longPassing: toNumber(get("long_passing")),
      ballControl: toNumber(get("ball_control")),
      acceleration: toNumber(get("acceleration")),
      sprintSpeed: toNumber(get("sprint_speed")),
      agility: toNumber(get("agility")),
      reactions: toNumber(get("reactions")),
      balance: toNumber(get("balance")),
      shotPower: toNumber(get("shot_power")),
      jumping: toNumber(get("jumping")),
      stamina: toNumber(get("stamina")),
      strength: toNumber(get("strength")),
      longShots: toNumber(get("long_shots")),
      aggression: toNumber(get("aggression")),
      interceptions: toNumber(get("interceptions")),
      positioning: toNumber(get("positioning")),
      vision: toNumber(get("vision")),
      penalties: toNumber(get("penalties")),
      composure: toNumber(get("composure")),
      marking: toNumber(get("marking")),
      standingTackle: toNumber(get("standing_tackle")),
      slidingTackle: toNumber(get("sliding_tackle")),
    },
  };
}

async function seed() {
  if (!hasCredentials || !db) {
    console.error("✗ Firebase admin not configured — check backend/.env");
    process.exit(1);
  }

  console.log(`Reading ${DATA_FILE} ...`);
  const text = readFileSync(DATA_FILE, "utf8");
  const rows = parseCsv(text);
  if (!rows.length) {
    console.error(`✗ Empty dataset: ${DATA_FILE}`);
    process.exit(1);
  }

  const header = rows[0];
  const col = {};
  header.forEach((name, index) => {
    col[name] = index;
  });

  const idCounts = new Map();
  const players = rows.slice(1).map((row) => mapPlayer(row, col, idCounts));
  console.log(`Parsed ${players.length} players`);

  const collection = db.collection(COLLECTIONS.players);
  const BATCH_SIZE = 450;
  let written = 0;
  const start = Date.now();

  for (let i = 0; i < players.length; i += BATCH_SIZE) {
    const batch = db.batch();
    const chunk = players.slice(i, i + BATCH_SIZE);
    for (const player of chunk) {
      batch.set(collection.doc(player.id), player);
    }
    await batch.commit();
    written += chunk.length;
    console.log(`Wrote ${written}/${players.length} (${Math.round((Date.now() - start) / 1000)}s)`);
  }

  console.log(`✓ Seeded ${written} players into "players" collection in ${((Date.now() - start) / 1000).toFixed(1)}s`);
}

seed().catch((err) => {
  console.error("✗ Seed failed:", err);
  process.exit(1);
});
