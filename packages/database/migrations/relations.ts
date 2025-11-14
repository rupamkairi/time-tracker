import { relations } from "drizzle-orm/relations";
import { logEntries, entryLinks } from "./schema";

export const entryLinksRelations = relations(entryLinks, ({one}) => ({
	logEntry: one(logEntries, {
		fields: [entryLinks.logEntryId],
		references: [logEntries.id]
	}),
}));

export const logEntriesRelations = relations(logEntries, ({many}) => ({
	entryLinks: many(entryLinks),
}));