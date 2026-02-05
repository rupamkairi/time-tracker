import { eq, count, desc, and, gte } from "drizzle-orm";
import { router, publicProcedure } from "../trpc";
import { db, project, task, taskLog } from "@time-tracker/database";
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

  getSummary: publicProcedure
    .input(getProjectSchema)
    .query(async ({ ctx, input }) => {
      const [foundProject] = await ctx.db
        .select()
        .from(project)
        .where(eq(project.id, input.id));

      if (!foundProject) {
        throw new Error("Project not found");
      }

      // Total tasks
      const [totalTasksResult] = await ctx.db
        .select({ count: count() })
        .from(task)
        .where(eq(task.projectId, input.id));
      
      // Status breakdown
      const statusBreakdown = await ctx.db
        .select({ status: task.status, count: count() })
        .from(task)
        .where(eq(task.projectId, input.id))
        .groupBy(task.status);
        
      // Weekly logs (last 7 days)
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];
      
      const [weeklyLogsResult] = await ctx.db
        .select({ count: count() })
        .from(taskLog)
        .innerJoin(task, eq(taskLog.taskId, task.id))
        .where(and(
            eq(task.projectId, input.id),
            gte(taskLog.logDate, sevenDaysAgoStr)
        ));

      // Last activity
      const [lastLog] = await ctx.db
        .select({ date: taskLog.logDate, time: taskLog.endTime })
        .from(taskLog)
        .innerJoin(task, eq(taskLog.taskId, task.id))
        .where(eq(task.projectId, input.id))
        .orderBy(desc(taskLog.logDate), desc(taskLog.endTime))
        .limit(1);

      return {
        project: foundProject,
        stats: {
            totalTasks: totalTasksResult?.count || 0,
            statusBreakdown,
            weeklyLogs: weeklyLogsResult?.count || 0,
            lastActivity: lastLog ? `${lastLog.date} ${lastLog.time || ''}`.trim() : null
        }
      };
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
