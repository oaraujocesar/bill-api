CREATE TABLE IF NOT EXISTS "account" (
    "id" serial PRIMARY KEY NOT NULL,
    "serial" varchar(26) NOT NULL,
    "name" varchar NOT NULL,
    "balance" numeric(10, 2) DEFAULT 0.00 NOT NULL,
    "user_id" uuid NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL,
    "deleted_at" timestamp
);
--> statement-breakpoint
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
 ALTER TABLE "account" ADD CONSTRAINT "account_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "account_serial_index" ON "account" USING btree ("serial");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_user_id_index" ON "account" USING btree ("user_id");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "profile_serial_index" ON "user_profile" USING btree ("serial");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "profile_user_id_index" ON "user_profile" USING btree ("user_id");

INSERT INTO
    auth.users (
        id,
        email,
        email_confirmed_at,
        is_super_admin
    )
VALUES (
        '6c6e1ced-a2cc-4dff-a15f-4d8926642b81',
        'test_user@bill.com.br',
        '2023-04-30',
        true
    );
