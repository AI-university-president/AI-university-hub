import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { getServerEnv } from "@/lib/env";
import * as schema from "@/db/schema";

const globalForDatabase = globalThis as unknown as {
  postgresClient?: ReturnType<typeof postgres>;
  db?: ReturnType<typeof drizzle>;
};

const { DATABASE_URL } = getServerEnv();

const postgresClient =
  globalForDatabase.postgresClient ??
  postgres(DATABASE_URL, {
    max: 1,
    prepare: false,
  });

export const db = globalForDatabase.db ?? drizzle(postgresClient, { schema });

if (process.env.NODE_ENV !== "production") {
  globalForDatabase.postgresClient = postgresClient;
  globalForDatabase.db = db;
}
