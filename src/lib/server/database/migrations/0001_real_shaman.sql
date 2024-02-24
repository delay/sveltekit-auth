ALTER TABLE "users" ADD COLUMN "provider" text DEFAULT 'email' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "provider_id" text DEFAULT '' NOT NULL;