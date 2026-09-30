CREATE TABLE `ingredients` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`category` text DEFAULT 'Divers' NOT NULL,
	`unit` text DEFAULT 'g' NOT NULL,
	`grams_per_piece` real,
	`kcal` real,
	`protein` real,
	`carbs` real,
	`fat` real,
	`is_pantry` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ingredients_name_idx` ON `ingredients` (`name`);--> statement-breakpoint
CREATE TABLE `meals` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`type` text NOT NULL,
	`recipe_id` text,
	`source_meal_id` text,
	`is_locked` integer DEFAULT false NOT NULL,
	`main_user_portion` real,
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `meals_date_type_idx` ON `meals` (`date`,`type`);--> statement-breakpoint
CREATE TABLE `members` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`multiplier` real DEFAULT 1 NOT NULL,
	`is_main_user` integer DEFAULT false NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`dislikes` text DEFAULT '' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `presence_overrides` (
	`member_id` text NOT NULL,
	`date` text NOT NULL,
	`meal_type` text NOT NULL,
	`status` text NOT NULL,
	PRIMARY KEY(`member_id`, `date`, `meal_type`),
	FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `presence_rules` (
	`member_id` text NOT NULL,
	`weekday` integer NOT NULL,
	`meal_type` text NOT NULL,
	`status` text NOT NULL,
	PRIMARY KEY(`member_id`, `weekday`, `meal_type`),
	FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `recipe_ingredients` (
	`id` text PRIMARY KEY NOT NULL,
	`recipe_id` text NOT NULL,
	`ingredient_id` text NOT NULL,
	`quantity` real NOT NULL,
	`note` text DEFAULT '' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `recipes` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`prep_time` integer DEFAULT 20 NOT NULL,
	`cook_time` integer DEFAULT 0 NOT NULL,
	`instructions` text DEFAULT '' NOT NULL,
	`tags` text DEFAULT '' NOT NULL,
	`seasons` text DEFAULT '' NOT NULL,
	`is_batchable` integer DEFAULT true NOT NULL,
	`is_favorite` integer DEFAULT false NOT NULL,
	`is_excluded` integer DEFAULT false NOT NULL,
	`rating` integer,
	`source_url` text,
	`image_url` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` integer PRIMARY KEY NOT NULL,
	`onboarded` integer DEFAULT false NOT NULL,
	`weekday_max_time` integer DEFAULT 45 NOT NULL,
	`weekend_max_time` integer DEFAULT 180 NOT NULL,
	`no_repeat_weeks` integer DEFAULT 3 NOT NULL,
	`leftover_strategy` text DEFAULT 'office' NOT NULL,
	`nutrition_enabled` integer DEFAULT false NOT NULL,
	`kcal_target` integer,
	`protein_target` integer,
	`carbs_target` integer,
	`fat_target` integer,
	`extra_kcal` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `shopping_checks` (
	`week_start` text NOT NULL,
	`key` text NOT NULL,
	PRIMARY KEY(`week_start`, `key`)
);
--> statement-breakpoint
CREATE TABLE `shopping_manual` (
	`id` text PRIMARY KEY NOT NULL,
	`week_start` text NOT NULL,
	`label` text NOT NULL,
	`category` text DEFAULT 'Divers' NOT NULL,
	`checked` integer DEFAULT false NOT NULL
);
