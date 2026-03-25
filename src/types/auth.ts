export type AppRole = "admin" | "member";

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  role: AppRole;
};
