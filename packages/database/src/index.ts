const config = {
  DATABASE_URL: process.env.DATABASE_URL,
  DATABASE_TOKEN: process.env.DATABASE_TOKEN,
};

// console.log("Environment Variables", config);

import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

const turso = createClient({
  url: config.DATABASE_URL,
  authToken: config.DATABASE_TOKEN,
});

export const db = drizzle(turso);

export function getDatabase() {
  console.log("Database connected");
  return db;
}
