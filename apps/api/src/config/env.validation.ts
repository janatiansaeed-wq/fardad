import { isAbsolute } from "node:path";
import { z } from "zod";

const nodeEnvironmentSchema = z.enum(["development", "test", "staging", "production"]);
const mediaDeliveryModeSchema = z.enum(["disabled", "local", "public"]);
const optionalEnvironmentString = z.preprocess(
  (value) => (typeof value === "string" && value.trim().length === 0 ? undefined : value),
  z.string().optional(),
);

export const envSchema = z
  .object({
    API_PORT: z.coerce.number().int().min(1).max(65_535).default(4000),
    AUTH_LOGIN_LOCK_MINUTES: z.coerce.number().int().min(1).max(1_440).default(15),
    AUTH_MAX_LOGIN_ATTEMPTS: z.coerce.number().int().min(1).max(20).default(5),
    COMMERCE_STORE_KEY: z
      .string()
      .min(1)
      .max(100)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    COMMERCE_BFF_SHARED_SECRET: z.string().min(32),
    DATABASE_URL: z.string().url(),
    JWT_ACCESS_SECRET: z.string().min(32),
    JWT_ACCESS_TTL_SECONDS: z.coerce.number().int().min(60).max(3_600).default(900),
    JWT_REFRESH_SECRET: z.string().min(32),
    JWT_REFRESH_TTL_SECONDS: z.coerce.number().int().min(86_400).max(2_592_000).default(2_592_000),
    MEDIA_DELIVERY_MODE: mediaDeliveryModeSchema.default("disabled"),
    MEDIA_LOCAL_ROOT: optionalEnvironmentString,
    MEDIA_PUBLIC_ORIGIN: optionalEnvironmentString,
    NODE_ENV: nodeEnvironmentSchema.default("development"),
  })
  .superRefine((value, context) => {
    const origin = parseOrigin(value.MEDIA_PUBLIC_ORIGIN, context);

    if (value.MEDIA_DELIVERY_MODE === "local") {
      if (value.NODE_ENV !== "development") {
        context.addIssue({
          code: "custom",
          message: "MEDIA_DELIVERY_MODE=local is allowed only in development",
          path: ["MEDIA_DELIVERY_MODE"],
        });
      }

      if (!value.MEDIA_LOCAL_ROOT || !isAbsolute(value.MEDIA_LOCAL_ROOT)) {
        context.addIssue({
          code: "custom",
          message: "MEDIA_LOCAL_ROOT must be an absolute path in local media mode",
          path: ["MEDIA_LOCAL_ROOT"],
        });
      }

      if (!origin || !isLoopbackHostname(origin.hostname)) {
        context.addIssue({
          code: "custom",
          message: "MEDIA_PUBLIC_ORIGIN must use a loopback host in local media mode",
          path: ["MEDIA_PUBLIC_ORIGIN"],
        });
      }
    }

    if (value.MEDIA_DELIVERY_MODE === "public" && (!origin || origin.protocol !== "https:")) {
      context.addIssue({
        code: "custom",
        message: "MEDIA_DELIVERY_MODE=public requires an HTTPS MEDIA_PUBLIC_ORIGIN",
        path: ["MEDIA_PUBLIC_ORIGIN"],
      });
    }

    if (value.NODE_ENV !== "development" && origin && origin.protocol !== "https:") {
      context.addIssue({
        code: "custom",
        message: "MEDIA_PUBLIC_ORIGIN must use HTTPS outside development",
        path: ["MEDIA_PUBLIC_ORIGIN"],
      });
    }
  });

function parseOrigin(value: string | undefined, context: z.RefinementCtx): URL | null {
  if (!value) {
    return null;
  }

  try {
    const origin = new URL(value);

    if (
      !["http:", "https:"].includes(origin.protocol) ||
      origin.username ||
      origin.password ||
      origin.search ||
      origin.hash
    ) {
      throw new Error("Unsupported media origin");
    }

    return origin;
  } catch {
    context.addIssue({
      code: "custom",
      message:
        "MEDIA_PUBLIC_ORIGIN must be an absolute HTTP(S) origin without credentials, query, or hash",
      path: ["MEDIA_PUBLIC_ORIGIN"],
    });
    return null;
  }
}

function isLoopbackHostname(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
}

export type Environment = z.infer<typeof envSchema>;
