import type { AppRole } from "@/types/auth";

export const authConfig = {
  sessionStrategy: "jwt",
  defaultRole: "member" as AppRole,
  signInPath: "/login",
} as const;

export type AuthConfig = typeof authConfig;
