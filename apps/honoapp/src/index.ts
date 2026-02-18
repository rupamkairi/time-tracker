import { trpcServer } from "@hono/trpc-server";
import { db } from "@time-tracker/database";
import { log } from "@time-tracker/logger";
import { appRouter, createContext } from "@time-tracker/trpc";
import { Hono } from "hono";
import { cors } from "hono/cors";

console.log("Process Env Vars from app Start");
console.log(process.env);
console.log("Process Env Vars from app End");
log("Hello World...");

const app = new Hono();

app.use(
  "/trpc/*",
  cors(),

  trpcServer({
    router: appRouter,
    createContext: async () => {
      return createContext();
    },

    onError({ error, path, input }) {
      console.error("❌ tRPC ERROR");
      console.error("Path:", path);
      console.error("Message:", error.message);
      console.error("Input:", input);
      console.error("Stack:", error.stack);
    },
  }),
);

export default {
  port: 10000,
  fetch: app.fetch,
};
