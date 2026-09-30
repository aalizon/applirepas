ALTER TABLE `ingredients` ADD `allergens` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `ingredients` ADD `animal` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `members` ADD `allergies` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `members` ADD `diet` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `members` ADD `likes` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `recipes` ADD `image_credit` text;--> statement-breakpoint
ALTER TABLE `settings` ADD `seed_version` integer DEFAULT 0 NOT NULL;