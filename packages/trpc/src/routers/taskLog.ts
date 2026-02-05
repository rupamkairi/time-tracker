import { eq } from "drizzle-orm";
import { router, publicProcedure } from "../trpc";
import { db, taskLog, task, taskLogDetail, reference } from "@time-tracker/database";
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
      // Handle logDate from startTime if not provided
      let logDate = input.logDate;
      if (!logDate && input.startTime) {
        try {
            logDate = new Date(input.startTime).toISOString().split('T')[0];
        } catch (e) {
            // If date parsing fails, ignore
        }
      }

      const values = {
          ...input,
          logDate: logDate || input.logDate,
      };

      const [newTaskLog] = await ctx.db
        .insert(taskLog)
        .values(values)
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
      
      // Fetch details
      const details = await ctx.db
        .select()
        .from(taskLogDetail)
        .where(eq(taskLogDetail.taskLogId, input.id));
        
      // Fetch references for each detail
      const detailsWithRefs = await Promise.all(details.map(async (detail) => {
          const refs = await ctx.db
            .select()
            .from(reference)
            .where(eq(reference.taskLogDetailId, detail.id));
          return { ...detail, references: refs };
      }));
      
      // Fetch task info if possible (taskId might be null if schema allows, but here it's likely present)
      let taskInfo = null;
      if (foundTaskLog.taskId) {
        const [t] = await ctx.db
            .select()
            .from(task)
            .where(eq(task.id, foundTaskLog.taskId));
        taskInfo = t;
      }

      return {
          ...foundTaskLog,
          task: taskInfo,
          details: detailsWithRefs
      };
    }),

  update: publicProcedure
    .input(updateTaskLogSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      
      // Also update logDate if startTime changes and logDate is not provided in update
      // But updateData might have partial fields.
      // If startTime is updated, should we update logDate?
      // Probably yes, if logDate isn't explicitly updated.
      // But we need the existing logDate or strict logic.
      // Let's simpler logic: if logDate is provided, use it.
      // If startTime is provided and logDate is NOT, maybe update it?
      // "Implement log date handling" - ensure logDate is properly set.
      
      let finalUpdateData = { ...updateData };
      
      if (updateData.startTime && !updateData.logDate) {
         try {
            finalUpdateData.logDate = new Date(updateData.startTime).toISOString().split('T')[0];
         } catch (e) {}
      }

      const [updatedTaskLog] = await ctx.db
        .update(taskLog)
        .set(finalUpdateData)
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
