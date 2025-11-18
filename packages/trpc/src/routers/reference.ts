import { eq } from "drizzle-orm";
import { router, publicProcedure } from "../trpc";
import { reference } from "@time-tracker/database";
import {
  createReferenceSchema,
  updateReferenceSchema,
  deleteReferenceSchema,
  getReferenceSchema,
} from "../schema";

export const referenceRouter = router({
  create: publicProcedure
    .input(createReferenceSchema)
    .mutation(async ({ ctx, input }) => {
      const [newReference] = await ctx.db
        .insert(reference)
        .values(input)
        .returning();
      return newReference;
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const references = await ctx.db.select().from(reference);
    return references;
  }),

  getById: publicProcedure
    .input(getReferenceSchema)
    .query(async ({ ctx, input }) => {
      const [foundReference] = await ctx.db
        .select()
        .from(reference)
        .where(eq(reference.id, input.id));

      if (!foundReference) {
        throw new Error("Reference not found");
      }

      return foundReference;
    }),

  getByTaskLogDetailId: publicProcedure
    .input(getReferenceSchema)
    .query(async ({ ctx, input }) => {
      const references = await ctx.db
        .select()
        .from(reference)
        .where(eq(reference.taskLogDetailId, input.id));

      return references;
    }),

  update: publicProcedure
    .input(updateReferenceSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      const [updatedReference] = await ctx.db
        .update(reference)
        .set(updateData)
        .where(eq(reference.id, id))
        .returning();

      if (!updatedReference) {
        throw new Error("Reference not found");
      }

      return updatedReference;
    }),

  delete: publicProcedure
    .input(deleteReferenceSchema)
    .mutation(async ({ ctx, input }) => {
      const [deletedReference] = await ctx.db
        .delete(reference)
        .where(eq(reference.id, input.id))
        .returning();

      if (!deletedReference) {
        throw new Error("Reference not found");
      }

      return { success: true, id: input.id };
    }),
});
