import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

const config = {
  DATABASE_URL: process.env.DATABASE_URL,
  DATABASE_TOKEN: process.env.DATABASE_TOKEN,
};

console.log(config);

const turso = createClient({
  url: config.DATABASE_URL,
  authToken: config.DATABASE_TOKEN,
});

export const db = drizzle(turso);

export * from "./db/schema";
