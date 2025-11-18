import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const task = sqliteTable("task", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at"),
});

// Log entries table
export const taskLog = sqliteTable("task_log", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  startTime: text("start_time"),
  endTime: text("end_time"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at"),
});

export const taskLogDetail = sqliteTable("task_log_detail", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  taskLogId: integer("task_log_id")
    .notNull()
    .references(() => taskLog.id, { onDelete: "cascade" }),
});

export const reference = sqliteTable("reference", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  taskLogDetailId: integer("task_log_detail_id")
    .notNull()
    .references(() => taskLogDetail.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  title: text("title"),
  linkType: text("link_type"),
  createdAt: text("created_at").notNull(),
});
