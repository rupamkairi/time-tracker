import { eq } from "drizzle-orm";
import { router, publicProcedure } from "../trpc";
import { db, project } from "@time-tracker/database";
import {
  createProjectSchema,
  updateProjectSchema,
  deleteProjectSchema,
  getProjectSchema,
} from "../schema";

export const projectRouter = router({
  create: publicProcedure
    .input(createProjectSchema)
    .mutation(async ({ ctx, input }) => {
      const [newProject] = await ctx.db.insert(project).values(input).returning();
      return newProject;
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const projects = await ctx.db.select().from(project);
    return projects;
  }),

  getById: publicProcedure
    .input(getProjectSchema)
    .query(async ({ ctx, input }) => {
      const [foundProject] = await ctx.db
        .select()
        .from(project)
        .where(eq(project.id, input.id));

      if (!foundProject) {
        throw new Error("Project not found");
      }

      return foundProject;
    }),

  update: publicProcedure
    .input(updateProjectSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      const [updatedProject] = await ctx.db
        .update(project)
        .set(updateData)
        .where(eq(project.id, id))
        .returning();

      if (!updatedProject) {
        throw new Error("Project not found");
      }

      return updatedProject;
    }),

  delete: publicProcedure
    .input(deleteProjectSchema)
    .mutation(async ({ ctx, input }) => {
      const [deletedProject] = await ctx.db
        .delete(project)
        .where(eq(project.id, input.id))
        .returning();

      if (!deletedProject) {
        throw new Error("Project not found");
      }

      return { success: true, id: input.id };
    }),
});
