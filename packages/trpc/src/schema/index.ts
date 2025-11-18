import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
});

export const updateTaskSchema = z.object({
  id: z.number(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  updatedAt: z.string(),
});

export const deleteTaskSchema = z.object({
  id: z.number(),
});

export const getTaskSchema = z.object({
  id: z.number(),
});

export const createTaskLogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
});

export const updateTaskLogSchema = z.object({
  id: z.number(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  updatedAt: z.string(),
});

export const deleteTaskLogSchema = z.object({
  id: z.number(),
});

export const getTaskLogSchema = z.object({
  id: z.number(),
});

export const createTaskLogDetailSchema = z.object({
  taskLogId: z.number(),
});

export const updateTaskLogDetailSchema = z.object({
  id: z.number(),
  taskLogId: z.number(),
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
  createdAt: z.string(),
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
