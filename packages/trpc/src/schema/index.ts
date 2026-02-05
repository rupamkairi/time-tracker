import { z } from "zod";

// Project Schemas
export const createProjectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  color: z.string().optional(),
});

export const updateProjectSchema = z.object({
  id: z.number(),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  color: z.string().optional(),
});

export const deleteProjectSchema = z.object({
  id: z.number(),
});

export const getProjectSchema = z.object({
  id: z.number(),
});

// Task Schemas
export const createTaskSchema = z.object({
  projectId: z.number().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["todo", "in_progress", "done"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  dueDate: z.string().optional(),
  order: z.number().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const updateTaskSchema = z.object({
  id: z.number(),
  projectId: z.number().optional(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(["todo", "in_progress", "done"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  dueDate: z.string().optional(),
  order: z.number().optional(),
  updatedAt: z.string().optional(),
});

export const deleteTaskSchema = z.object({
  id: z.number(),
});

export const getTaskSchema = z.object({
  id: z.number(),
});

// Task Log Schemas
export const createTaskLogSchema = z.object({
  taskId: z.number().optional(), // Nullable in schema? No, I added taskId to taskLog. Check schema.ts.
  // schema.ts: taskId: integer("task_id").references(...)
  // It is NOT .notNull(). So nullable.
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  logDate: z.string().optional(),
  timezone: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const updateTaskLogSchema = z.object({
  id: z.number(),
  taskId: z.number().optional(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  logDate: z.string().optional(),
  timezone: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const deleteTaskLogSchema = z.object({
  id: z.number(),
});

export const getTaskLogSchema = z.object({
  id: z.number(),
});

export const createTaskLogDetailSchema = z.object({
  taskLogId: z.number(),
  content: z.string().optional(),
});

export const updateTaskLogDetailSchema = z.object({
  id: z.number(),
  taskLogId: z.number(),
  content: z.string().optional(),
});

export const deleteTaskLogDetailSchema = z.object({
  id: z.number(),
});

export const getTaskLogDetailSchema = z.object({
  id: z.number(),
});

export const createReferenceSchema = z.object({
  taskLogDetailId: z.number(),
  url: z.string().url("Must be a valid URL"),
  title: z.string().optional(),
  linkType: z.string().optional(),
  createdAt: z.string().optional(),
});

export const updateReferenceSchema = z.object({
  id: z.number(),
  taskLogDetailId: z.number().optional(),
  url: z.string().url().optional(),
  title: z.string().optional(),
  linkType: z.string().optional(),
});

export const deleteReferenceSchema = z.object({
  id: z.number(),
});

export const getReferenceSchema = z.object({
  id: z.number(),
});
