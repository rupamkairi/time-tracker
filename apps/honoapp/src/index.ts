import { Hono } from "hono";
import { log } from "@time-tracker/logger";

log("Hello World...");

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default {
  port: 10000,
  fetch: app.fetch,
};
