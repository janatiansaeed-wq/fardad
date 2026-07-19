import { z } from "zod";

const nodeEnvironmentSchema = z.enum(["development", "test", "staging", "production"]);

export const envSchema = z.object({
  API_PORT: z.coerce.number().int().min(1).max(65_535).default(4000),
  DATABASE_URL: z.string().url(),
  NODE_ENV: nodeEnvironmentSchema.default("development"),
});

export type Environment = z.infer<typeof envSchema>;
