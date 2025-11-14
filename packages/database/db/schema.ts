import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Log entries table
export const logEntries = sqliteTable("log_entries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  startTime: text("start_time"),
  endTime: text("end_time"),
  status: text("status"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// Entry links table
export const entryLinks = sqliteTable("entry_links", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  logEntryId: integer("log_entry_id")
    .notNull()
    .references(() => logEntries.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  title: text("title"),
  linkType: text("link_type"),
  createdAt: text("created_at").notNull(),
});
