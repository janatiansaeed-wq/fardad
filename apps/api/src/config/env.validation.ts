import { z } from "zod";

const nodeEnvironmentSchema = z.enum(["development", "test", "staging", "production"]);

export const envSchema = z.object({
  API_PORT: z.coerce.number().int().min(1).max(65_535).default(4000),
  AUTH_LOGIN_LOCK_MINUTES: z.coerce.number().int().min(1).max(1_440).default(15),
  AUTH_MAX_LOGIN_ATTEMPTS: z.coerce.number().int().min(1).max(20).default(5),
  DATABASE_URL: z.string().url(),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_ACCESS_TTL_SECONDS: z.coerce.number().int().min(60).max(3_600).default(900),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_REFRESH_TTL_SECONDS: z.coerce.number().int().min(86_400).max(2_592_000).default(2_592_000),
  NODE_ENV: nodeEnvironmentSchema.default("development"),
});

export type Environment = z.infer<typeof envSchema>;
