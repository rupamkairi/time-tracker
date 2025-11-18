import { eq } from "drizzle-orm";
import { router, publicProcedure } from "../trpc";
import { taskLogDetail } from "@time-tracker/database";
import {
  createTaskLogDetailSchema,
  updateTaskLogDetailSchema,
  deleteTaskLogDetailSchema,
  getTaskLogDetailSchema,
} from "../schema";

export const taskLogDetailRouter = router({
  create: publicProcedure
    .input(createTaskLogDetailSchema)
    .mutation(async ({ ctx, input }) => {
      const [newTaskLogDetail] = await ctx.db
        .insert(taskLogDetail)
        .values(input)
        .returning();
      return newTaskLogDetail;
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const taskLogDetails = await ctx.db.select().from(taskLogDetail);
    return taskLogDetails;
  }),

  getById: publicProcedure
    .input(getTaskLogDetailSchema)
    .query(async ({ ctx, input }) => {
      const [foundTaskLogDetail] = await ctx.db
        .select()
        .from(taskLogDetail)
        .where(eq(taskLogDetail.id, input.id));

      if (!foundTaskLogDetail) {
        throw new Error("Task log detail not found");
      }

      return foundTaskLogDetail;
    }),

  getByTaskLogId: publicProcedure
    .input(getTaskLogDetailSchema)
    .query(async ({ ctx, input }) => {
      const details = await ctx.db
        .select()
        .from(taskLogDetail)
        .where(eq(taskLogDetail.taskLogId, input.id));

      return details;
    }),

  update: publicProcedure
    .input(updateTaskLogDetailSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      const [updatedTaskLogDetail] = await ctx.db
        .update(taskLogDetail)
        .set(updateData)
        .where(eq(taskLogDetail.id, id))
        .returning();

      if (!updatedTaskLogDetail) {
        throw new Error("Task log detail not found");
      }

      return updatedTaskLogDetail;
    }),

  delete: publicProcedure
    .input(deleteTaskLogDetailSchema)
    .mutation(async ({ ctx, input }) => {
      const [deletedTaskLogDetail] = await ctx.db
        .delete(taskLogDetail)
        .where(eq(taskLogDetail.id, input.id))
        .returning();

      if (!deletedTaskLogDetail) {
        throw new Error("Task log detail not found");
      }

      return { success: true, id: input.id };
    }),
});
