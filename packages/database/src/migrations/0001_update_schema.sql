CREATE TABLE `project` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`color` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text
);
--> statement-breakpoint
DROP INDEX "task_project_id_idx";--> statement-breakpoint
DROP INDEX "task_log_log_date_idx";--> statement-breakpoint
DROP INDEX "task_log_task_id_idx";--> statement-breakpoint
ALTER TABLE `links` ALTER COLUMN "created_at" TO "created_at" text NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
CREATE INDEX `task_project_id_idx` ON `task` (`project_id`);--> statement-breakpoint
CREATE INDEX `task_log_log_date_idx` ON `task_log` (`log_date`);--> statement-breakpoint
CREATE INDEX `task_log_task_id_idx` ON `task_log` (`task_id`);--> statement-breakpoint
ALTER TABLE `task` ALTER COLUMN "created_at" TO "created_at" text NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `task` ADD `project_id` integer REFERENCES project(id);--> statement-breakpoint
ALTER TABLE `task` ADD `status` text DEFAULT 'todo';--> statement-breakpoint
ALTER TABLE `task` ADD `priority` text DEFAULT 'medium';--> statement-breakpoint
ALTER TABLE `task` ADD `due_date` text;--> statement-breakpoint
ALTER TABLE `task` ADD `order` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `task_log` ALTER COLUMN "created_at" TO "created_at" text NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `task_log` ADD `task_id` integer REFERENCES task(id);--> statement-breakpoint
ALTER TABLE `task_log` ADD `log_date` text;--> statement-breakpoint
ALTER TABLE `task_log` ADD `timezone` text;--> statement-breakpoint
ALTER TABLE `task_log_details` ADD `content` text;