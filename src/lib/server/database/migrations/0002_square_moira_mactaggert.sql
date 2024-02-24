ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT '2024-02-23T21:48:53.290Z';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT '2024-02-23T21:48:53.291Z';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" DROP NOT NULL;