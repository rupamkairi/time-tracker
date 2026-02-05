import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const project = sqliteTable("project", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  color: text("color"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const task = sqliteTable("task", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  projectId: integer("project_id").references(() => project.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").default("todo"),
  priority: text("priority").default("medium"),
  dueDate: text("due_date"),
  order: integer("order").default(0),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").$onUpdate(() => sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  projectIdIdx: index("task_project_id_idx").on(table.projectId),
}));

// Log entries table
export const taskLog = sqliteTable("task_log", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  taskId: integer("task_id").references(() => task.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  startTime: text("start_time"),
  endTime: text("end_time"),
  logDate: text("log_date"),
  timezone: text("timezone"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").$onUpdate(() => sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  logDateIdx: index("task_log_log_date_idx").on(table.logDate),
  taskIdIdx: index("task_log_task_id_idx").on(table.taskId),
}));

export const taskLogDetail = sqliteTable("task_log_details", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  taskLogId: integer("task_log_id")
    .notNull()
    .references(() => taskLog.id, { onDelete: "cascade" }),
  content: text("content"),
});

export const reference = sqliteTable("links", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  taskLogDetailId: integer("task_log_detail_id")
    .notNull()
    .references(() => taskLogDetail.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  title: text("title"),
  linkType: text("link_type"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
