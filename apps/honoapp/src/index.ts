import { Hono } from "hono";
import { log } from "@monorepo/logger";

log("Hello World...");

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default app;
