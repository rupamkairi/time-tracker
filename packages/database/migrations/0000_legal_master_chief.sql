-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `entry_links` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`log_entry_id` integer NOT NULL,
	`url` text NOT NULL,
	`title` text,
	`link_type` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`log_entry_id`) REFERENCES `log_entries`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `log_entries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`start_time` text,
	`end_time` text,
	`status` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);

*/