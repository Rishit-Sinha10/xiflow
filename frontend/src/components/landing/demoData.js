export const DEMO_TEAM = {
  name: "VRTX FC",
  league: "Premier League",
  country: "England",
};

const PLAYERS = [
  { id: "gk", name: "Alisson Becker", short: "Alisson", role: "GK", position: "Goalkeeper", rating: 88, age: 32 },
  { id: "rb", name: "Trent Alexander-Arnold", short: "Trent", role: "DEF", position: "Right Back", rating: 84, age: 27 },
  { id: "lcb", name: "Virgil van Dijk", short: "Van Dijk", role: "DEF", position: "Centre Back", rating: 87, age: 33 },
  { id: "rcb", name: "Ibrahima Konaté", short: "Konaté", role: "DEF", position: "Centre Back", rating: 82, age: 27 },
  { id: "lb", name: "Andy Robertson", short: "Robertson", role: "DEF", position: "Left Back", rating: 83, age: 32 },
  { id: "lcm", name: "Alexis Mac Allister", short: "Mac Allister", role: "MID", position: "Midfielder", rating: 84, age: 27 },
  { id: "cm", name: "Ryan Gravenberch", short: "Gravenberch", role: "MID", position: "Midfielder", rating: 82, age: 24 },
  { id: "rcm", name: "Dominik Szoboszlai", short: "Szoboszlai", role: "MID", position: "Midfielder", rating: 83, age: 24 },
  { id: "lw", name: "Luis Díaz", short: "Díaz", role: "FWD", position: "Left Wing", rating: 85, age: 29 },
  { id: "st", name: "Darwin Núñez", short: "Núñez", role: "FWD", position: "Striker", rating: 82, age: 25 },
  { id: "rw", name: "Mohamed Salah", short: "Salah", role: "FWD", position: "Right Wing", rating: 89, age: 32 },
];

const POOL = {
  GK: [PLAYERS[0]],
  DEF: [PLAYERS[1], PLAYERS[2], PLAYERS[3], PLAYERS[4]],
  MID: [PLAYERS[5], PLAYERS[6], PLAYERS[7]],
  FWD: [PLAYERS[8], PLAYERS[9], PLAYERS[10]],
};

const ROLE_FALLBACK = { GK: "GK", DEF: "DEF", MID: "MID", FWD: "FWD" };

export function buildDemoLineup(formationSlots) {
  const counts = { GK: 0, DEF: 0, MID: 0, FWD: 0 };
  const lineup = {};
  for (const slot of formationSlots) {
    const role = ROLE_FALLBACK[slot.role] || "MID";
    const pool = POOL[role];
    const player = pool[counts[role] % pool.length];
    counts[role] += 1;
    lineup[slot.id] = { ...player };
  }
  return lineup;
}

export const DEMO_FORMATION_CYCLE = ["4-3-3", "4-2-3-1", "3-5-2", "4-4-2"];
