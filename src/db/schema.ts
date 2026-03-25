import { sql } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const appRoleEnum = pgEnum("app_role", ["admin", "member"]);
export const userStatusEnum = pgEnum("user_status", ["active", "suspended", "invited"]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  role: appRoleEnum("role").notNull().default("member"),
  status: userStatusEnum("status").notNull().default("active"),
  emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true }),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  suspendedAt: timestamp("suspended_at", { withTimezone: true }),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().default(sql`now()`),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
