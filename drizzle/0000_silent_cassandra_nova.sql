CREATE TABLE IF NOT EXISTS "auth"."users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" varchar NOT NULL,
	"email_confirmed_at" timestamp,
	"is_super_admin" boolean DEFAULT false,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_profile" (
	"id" serial PRIMARY KEY NOT NULL,
	"serial" varchar(26) NOT NULL,
	"name" varchar NOT NULL,
	"surname" varchar NOT NULL,
	"birth_date" date NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "serial_index" ON "user_profile" USING btree ("serial");