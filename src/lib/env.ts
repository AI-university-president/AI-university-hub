import { z } from "zod";

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().url(),
  AUTH_URL: z.string().url().optional(),
  AUTH_SECRET: z.string().min(32).optional(),
});

const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;

export function getServerEnv(): ServerEnv {
  return serverEnvSchema.parse({
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    AUTH_URL: process.env.AUTH_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
  });
}

export function getClientEnv(): ClientEnv {
  return clientEnvSchema.parse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  });
}
