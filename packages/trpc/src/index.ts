import { z } from "zod";
import { referenceRouter } from "./routers/reference";
import { projectRouter } from "./routers/project";
import { taskRouter } from "./routers/task";
import { taskLogRouter } from "./routers/taskLog";
import { taskLogDetailRouter } from "./routers/taskLogDetail";
import { calendarRouter } from "./routers/calendar";
import { publicProcedure as procedure, router } from "./trpc";

const helloInputSchema = z.preprocess(
  (val) =>
    val == null
      ? null
      : typeof val === "string"
        ? val
        : typeof val === "object" && "0" in val
          ? (val as any)["0"]
          : val,
  // result is a nullable string; enforce a sensible max length
  z.string().max(100).nullish(),
);

export const appRouter = router({
  hello: procedure
    // accept either a plain string/nullish OR the positional object produced by batched requests
    // validation & coercion handled by `helloInputSchema`
    .input(helloInputSchema)
    .query(({ input }) => {
      // input is already validated/coerced to `string | null | undefined`
      const name = input?.trim() ?? "World";
      return `Hello ${name}!`;
    }),
  project: projectRouter,
  task: taskRouter,
  taskLog: taskLogRouter,
  taskLogDetail: taskLogDetailRouter,
  reference: referenceRouter,
  calendar: calendarRouter,
});

export type AppRouter = typeof appRouter;

export * from "./context";
export * from "./trpc";
