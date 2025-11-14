import { trpcServer } from "@hono/trpc-server";
import { getDatabase } from "@time-tracker/database";
import { log } from "@time-tracker/logger";
import { appRouter } from "@time-tracker/trpc";
import { Hono } from "hono";
import { cors } from "hono/cors";

log("Hello World...");
// log(getDatabase());

const app = new Hono();

app.use(
  "/trpc/*",
  cors(),
  trpcServer({
    router: appRouter,
  })
);

export default {
  port: 10000,
  fetch: app.fetch,
};
