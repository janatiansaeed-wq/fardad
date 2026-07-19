import { envSchema } from "./env.validation";

export const env = envSchema.parse(process.env);
