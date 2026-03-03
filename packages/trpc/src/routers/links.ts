import { eq } from "drizzle-orm";
import { router, publicProcedure } from "../trpc";
import { links } from "@time-tracker/database";
import {
  createLinksSchema,
  updateLinksSchema,
  deleteLinksSchema,
  getLinksSchema,
} from "../schema";

export const linksRouter = router({
  create: publicProcedure
    .input(createLinksSchema)
    .mutation(async ({ ctx, input }) => {
      const [newLink] = await ctx.db
        .insert(links)
        .values(input)
        .returning();
      return newLink;
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const allLinks = await ctx.db.select().from(links);
    return allLinks;
  }),

  getById: publicProcedure
    .input(getLinksSchema)
    .query(async ({ ctx, input }) => {
      const [foundLink] = await ctx.db
        .select()
        .from(links)
        .where(eq(links.id, input.id));

      if (!foundLink) {
        throw new Error("Link not found");
      }

      return foundLink;
    }),

  getByTaskLogDetailId: publicProcedure
    .input(getLinksSchema)
    .query(async ({ ctx, input }) => {
      const allLinks = await ctx.db
        .select()
        .from(links)
        .where(eq(links.taskLogDetailId, input.id));

      return allLinks;
    }),

  update: publicProcedure
    .input(updateLinksSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      const [updatedLink] = await ctx.db
        .update(links)
        .set(updateData)
        .where(eq(links.id, id))
        .returning();

      if (!updatedLink) {
        throw new Error("Link not found");
      }

      return updatedLink;
    }),

  delete: publicProcedure
    .input(deleteLinksSchema)
    .mutation(async ({ ctx, input }) => {
      const [deletedLink] = await ctx.db
        .delete(links)
        .where(eq(links.id, input.id))
        .returning();

      if (!deletedLink) {
        throw new Error("Link not found");
      }

      return { success: true, id: input.id };
    }),
});
