import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { db, taskLog, task, project } from "@time-tracker/database";
import { eq, and, gte, lte, desc } from "drizzle-orm";

export const calendarRouter = router({
  getRange: publicProcedure
    .input(z.object({
        from: z.string(),
        to: z.string(),
    }))
    .query(async ({ ctx, input }) => {
        const logs = await ctx.db
            .select({
                id: taskLog.id,
                taskId: taskLog.taskId,
                title: taskLog.title,
                startTime: taskLog.startTime,
                endTime: taskLog.endTime,
                logDate: taskLog.logDate,
                timezone: taskLog.timezone,
                taskTitle: task.title,
                projectId: task.projectId,
                projectName: project.name,
                projectColor: project.color,
            })
            .from(taskLog)
            .innerJoin(task, eq(taskLog.taskId, task.id))
            .leftJoin(project, eq(task.projectId, project.id))
            .where(and(
                gte(taskLog.logDate, input.from),
                lte(taskLog.logDate, input.to)
            ))
            .orderBy(taskLog.logDate, taskLog.startTime);
            
        return logs;
    }),

  getDay: publicProcedure
    .input(z.object({
        date: z.string(),
    }))
    .query(async ({ ctx, input }) => {
        const logs = await ctx.db
            .select({
                id: taskLog.id,
                taskId: taskLog.taskId,
                title: taskLog.title,
                startTime: taskLog.startTime,
                endTime: taskLog.endTime,
                logDate: taskLog.logDate,
                timezone: taskLog.timezone,
                taskTitle: task.title,
                projectId: task.projectId,
                projectName: project.name,
                projectColor: project.color,
            })
            .from(taskLog)
            .innerJoin(task, eq(taskLog.taskId, task.id))
            .leftJoin(project, eq(task.projectId, project.id))
            .where(eq(taskLog.logDate, input.date))
            .orderBy(taskLog.startTime);
            
        return logs;
    }),
});
