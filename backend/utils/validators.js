import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().trim().email("A valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().trim().min(1, "Name is required").max(60),
});

export const loginSchema = z.object({
  idToken: z.string().min(1, "idToken is required"),
});

export const refreshSchema = z.object({
  token: z.string().min(1, "token is required"),
});

export const updateProfileSchema = z
  .object({
    displayName: z.string().trim().min(1).max(60).optional(),
    preferences: z
      .object({
        theme: z.enum(["light", "dark"]).optional(),
        defaultFormation: z.string().trim().optional(),
        notifications: z.boolean().optional(),
      })
      .optional(),
  })
  .optional();

export const listPlayersQuery = z.object({
  q: z.string().trim().optional(),
  position: z.string().trim().optional(),
  nationality: z.string().trim().optional(),
  sort: z.enum(["rating", "name", "age", "value"]).optional(),
  limit: z.coerce.number().int().min(1).max(500).optional(),
  page: z.coerce.number().int().min(1).optional(),
});

export const searchPlayersQuery = z.object({
  q: z.string().trim().min(3, "Search query must be at least 3 characters"),
});

export const playerParams = z.object({
  id: z.string().trim().min(1),
});

export const positionParams = z.object({
  pos: z.string().trim().min(1),
});

const lineupPlayerSchema = z
  .object({
    id: z.string().trim().min(1),
    name: z.string().trim().min(1),
    position: z.string().trim().optional(),
    rating: z.number().optional(),
    age: z.number().optional(),
  })
  .passthrough();

const lineupPlayersSchema = z.record(z.string().trim().min(1), lineupPlayerSchema);

export const createLineupSchema = z.object({
  name: z.string().trim().min(1, "Lineup name is required").max(120),
  formation: z.string().trim().min(1).max(20).default("4-3-3"),
  teamId: z.string().trim().min(1).max(80).nullable().optional(),
  players: lineupPlayersSchema.default({}),
});

export const updateLineupSchema = z
  .object({
    name: z.string().trim().min(1, "Lineup name is required").max(120).optional(),
    formation: z.string().trim().min(1).max(20).optional(),
    teamId: z.string().trim().min(1).max(80).nullable().optional(),
    players: lineupPlayersSchema.optional(),
  })
  .refine((v) => Object.keys(v).length > 0, {
    message: "At least one field is required to update",
  });

export const lineupParams = z.object({
  id: z.string().trim().min(1),
});

const teamBaseSchema = z.object({
  name: z.string().trim().min(1, "Team name is required").max(80),
  badge: z.string().trim().max(500).optional(),
  shortName: z.string().trim().max(20).optional(),
  league: z.string().trim().max(80).optional(),
  country: z.string().trim().max(80).optional(),
  founded: z.coerce.number().int().min(1800).max(2100).nullable().optional(),
  color: z
    .string()
    .trim()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Invalid color")
    .optional(),
});

export const createTeamSchema = teamBaseSchema;

export const updateTeamSchema = teamBaseSchema
  .partial()
  .refine((v) => Object.keys(v).length > 0, {
    message: "At least one field is required to update",
  });

export const teamParams = z.object({
  id: z.string().trim().min(1),
});

export const teamMemberParams = z.object({
  id: z.string().trim().min(1),
  memberUid: z.string().trim().min(1),
});

export const addTeamMemberSchema = z.object({
  uid: z.string().trim().min(1, "User uid is required"),
});

export const createShareSchema = z.object({
  maxViews: z.coerce.number().int().min(1).max(100000).nullable().optional(),
  expiresInDays: z.coerce.number().int().min(1).max(365).nullable().optional(),
});

export const lineupIdParams = z.object({
  id: z.string().trim().min(1),
});

export const accessCodeParams = z.object({
  accessCode: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9]{4,20}$/, "Invalid access code"),
});

export const shareIdParams = z.object({
  shareId: z.string().trim().min(1),
});

export const waitlistSchema = z.object({
  email: z.string().trim().email("A valid email is required"),
  name: z.string().trim().max(80).optional(),
});
