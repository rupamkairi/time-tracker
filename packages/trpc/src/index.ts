import { z } from "zod";
import { referenceRouter } from "./routers/reference";
import { taskRouter } from "./routers/task";
import { taskLogRouter } from "./routers/taskLog";
import { taskLogDetailRouter } from "./routers/taskLogDetail";
import { publicProcedure as procedure, router } from "./trpc";

export const appRouter = router({
  hello: procedure.input(z.string().nullish()).query(({ input }) => {
    return `Hello ${input ?? "World"}!`;
  }),
  task: taskRouter,
  taskLog: taskLogRouter,
  taskLogDetail: taskLogDetailRouter,
  reference: referenceRouter,
});

export type AppRouter = typeof appRouter;

export * from "./context";
export * from "./trpc";
