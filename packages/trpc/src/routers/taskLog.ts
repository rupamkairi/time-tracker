import { eq } from "drizzle-orm";
import { router, publicProcedure } from "../trpc";
import {
  db,
  taskLog,
  task,
  taskLogDetail,
  links,
} from "@time-tracker/database";
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
          logDate = new Date(input.startTime).toISOString().split("T")[0];
        } catch (e) {
          // If date parsing fails, ignore
        }
      }

      const { links: inputLinks, ...taskLogValues } = input;

      const values = {
        ...taskLogValues,
        logDate: logDate || input.logDate,
      };

      const [newTaskLog] = await ctx.db
        .insert(taskLog)
        .values(values)
        .returning();

      // If links are provided, create a default taskLogDetail and associated links
      if (inputLinks && inputLinks.length > 0) {
        const [newDetail] = await ctx.db
          .insert(taskLogDetail)
          .values({
            taskLogId: newTaskLog.id,
            content: "Links added during log creation",
          })
          .returning();

        const linksToInsert = inputLinks.map((link) => ({
          ...link,
          taskLogDetailId: newDetail.id,
        }));

        await ctx.db.insert(links).values(linksToInsert);
      }

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

      // Fetch links for each detail
      const detailsWithLinks = await Promise.all(
        details.map(async (detail) => {
          const lks = await ctx.db
            .select()
            .from(links)
            .where(eq(links.taskLogDetailId, detail.id));
          return { ...detail, links: lks };
        }),
      );

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
        details: detailsWithLinks,
      };
    }),

  update: publicProcedure
    .input(updateTaskLogSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, links: inputLinks, ...updateData } = input;

      // Also update logDate if startTime changes and logDate is not provided in update
      let finalUpdateData = { ...updateData };

      if (updateData.startTime && !updateData.logDate) {
        try {
          finalUpdateData.logDate = new Date(updateData.startTime)
            .toISOString()
            .split("T")[0];
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

      // Handle links update (Replace All strategy for simplicity in modal)
      if (inputLinks !== undefined) {
        // Find or create a detail to attach links to
        let [existingDetail] = await ctx.db
          .select()
          .from(taskLogDetail)
          .where(eq(taskLogDetail.taskLogId, id))
          .limit(1);

        if (!existingDetail) {
          [existingDetail] = await ctx.db
            .insert(taskLogDetail)
            .values({
              taskLogId: id,
              content: "Links updated",
            })
            .returning();
        }

        // Delete existing links for this detail
        await ctx.db
          .delete(links)
          .where(eq(links.taskLogDetailId, existingDetail.id));

        // Insert new links
        if (inputLinks.length > 0) {
          const linksToInsert = inputLinks.map((link) => ({
            url: link.url,
            title: link.title,
            linkType: link.linkType,
            taskLogDetailId: existingDetail.id,
          }));

          await ctx.db.insert(links).values(linksToInsert);
        }
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
