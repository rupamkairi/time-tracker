import { initTRPC } from "@trpc/server";
import SuperJSON from "superjson";
import { Context } from "./context";

const t = initTRPC.context<Context>().create({
  transformer: SuperJSON,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        stack:
          process.env.NODE_ENV === "development" ? shape.data.stack : undefined,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;
