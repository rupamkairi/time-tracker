CREATE TABLE `links` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`task_log_detail_id` integer NOT NULL,
	`url` text NOT NULL,
	`title` text,
	`link_type` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`task_log_detail_id`) REFERENCES `task_log_details`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `task` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`created_at` text NOT NULL,
	`updated_at` text
);
--> statement-breakpoint
CREATE TABLE `task_log` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`start_time` text,
	`end_time` text,
	`created_at` text NOT NULL,
	`updated_at` text
);
--> statement-breakpoint
CREATE TABLE `task_log_details` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`task_log_id` integer NOT NULL,
	FOREIGN KEY (`task_log_id`) REFERENCES `task_log`(`id`) ON UPDATE no action ON DELETE cascade
);
