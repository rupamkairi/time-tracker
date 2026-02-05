import { eq } from "drizzle-orm";
import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { db, task } from "@time-tracker/database";
import {
  createTaskSchema,
  updateTaskSchema,
  deleteTaskSchema,
  getTaskSchema,
} from "../schema";

export const taskRouter = router({
  create: publicProcedure
    .input(createTaskSchema)
    .mutation(async ({ ctx, input }) => {
      const [newTask] = await ctx.db.insert(task).values(input).returning();
      return newTask;
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const tasks = await ctx.db.select().from(task);
    return tasks;
  }),

  getByProjectId: publicProcedure
    .input(z.object({ projectId: z.number() }))
    .query(async ({ ctx, input }) => {
      const tasks = await ctx.db
        .select()
        .from(task)
        .where(eq(task.projectId, input.projectId));
      return tasks;
    }),

  getById: publicProcedure
    .input(getTaskSchema)
    .query(async ({ ctx, input }) => {
      const [foundTask] = await ctx.db
        .select()
        .from(task)
        .where(eq(task.id, input.id));

      if (!foundTask) {
        throw new Error("Task not found");
      }

      return foundTask;
    }),

  update: publicProcedure
    .input(updateTaskSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      const [updatedTask] = await ctx.db
        .update(task)
        .set(updateData)
        .where(eq(task.id, id))
        .returning();

      if (!updatedTask) {
        throw new Error("Task not found");
      }

      return updatedTask;
    }),

  updateOrder: publicProcedure
    .input(z.array(z.object({ id: z.number(), order: z.number() })))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        for (const item of input) {
            await tx.update(task)
                .set({ order: item.order })
                .where(eq(task.id, item.id));
        }
      });
      return { success: true };
    }),

  delete: publicProcedure
    .input(deleteTaskSchema)
    .mutation(async ({ ctx, input }) => {
      const [deletedTask] = await ctx.db
        .delete(task)
        .where(eq(task.id, input.id))
        .returning();

      if (!deletedTask) {
        throw new Error("Task not found");
      }

      return { success: true, id: input.id };
    }),
});
