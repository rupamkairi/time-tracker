import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const entryLinks = sqliteTable("entry_links", {
  id: integer().primaryKey({ autoIncrement: true }).notNull(),
  logEntryId: integer("log_entry_id")
    .notNull()
    .references(() => logEntries.id, { onDelete: "cascade" }),
  url: text().notNull(),
  title: text(),
  linkType: text("link_type"),
  createdAt: text("created_at").notNull(),
});

export const logEntries = sqliteTable("log_entries", {
  id: integer().primaryKey({ autoIncrement: true }).notNull(),
  title: text().notNull(),
  description: text(),
  startTime: text("start_time"),
  endTime: text("end_time"),
  status: text(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
