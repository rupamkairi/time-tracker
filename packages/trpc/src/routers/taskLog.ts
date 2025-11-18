import { eq } from "drizzle-orm";
import { router, publicProcedure } from "../trpc";
import { taskLog } from "@time-tracker/database";
import {
  createTaskLogSchema,
  updateTaskLogSchema,
  deleteTaskLogSchema,
  getTaskLogSchema,
} from "../schema";

export const taskLogRouter = router({
  create: publicProcedure
    .input(createTaskLogSchema)
    .mutation(async ({ ctx, input }) => {
      const [newTaskLog] = await ctx.db
        .insert(taskLog)
        .values(input)
        .returning();
      return newTaskLog;
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const taskLogs = await ctx.db.select().from(taskLog);
    return taskLogs;
  }),

  getById: publicProcedure
    .input(getTaskLogSchema)
    .query(async ({ ctx, input }) => {
      const [foundTaskLog] = await ctx.db
        .select()
        .from(taskLog)
        .where(eq(taskLog.id, input.id));

      if (!foundTaskLog) {
        throw new Error("Task log not found");
      }

      return foundTaskLog;
    }),

  update: publicProcedure
    .input(updateTaskLogSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      const [updatedTaskLog] = await ctx.db
        .update(taskLog)
        .set(updateData)
        .where(eq(taskLog.id, id))
        .returning();

      if (!updatedTaskLog) {
        throw new Error("Task log not found");
      }

      return updatedTaskLog;
    }),

  delete: publicProcedure
    .input(deleteTaskLogSchema)
    .mutation(async ({ ctx, input }) => {
      const [deletedTaskLog] = await ctx.db
        .delete(taskLog)
        .where(eq(taskLog.id, input.id))
        .returning();

      if (!deletedTaskLog) {
        throw new Error("Task log not found");
      }

      return { success: true, id: input.id };
    }),
});
