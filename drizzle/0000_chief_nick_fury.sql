CREATE SCHEMA IF NOT EXISTS "auth";--> statement-breakpoint
CREATE TYPE "public"."type" AS ENUM('income', 'expense');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"serial" varchar(26) NOT NULL,
	"name" varchar NOT NULL,
	"balance" numeric(10, 2) DEFAULT 0.00 NOT NULL,
	"user_id" uuid NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "cards" (
	"id" serial PRIMARY KEY NOT NULL,
	"serial" varchar(26) NOT NULL,
	"name" varchar NOT NULL,
	"limit" numeric(10, 2) DEFAULT 0.00 NOT NULL,
	"due_date" integer NOT NULL,
	"user_id" uuid NOT NULL,
	"family_id" integer,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"icon_name" varchar NOT NULL,
	"user_id" uuid,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"serial" varchar(26) NOT NULL,
	"title" varchar NOT NULL,
	"description" text,
	"amount" numeric(10, 2) DEFAULT 0.00 NOT NULL,
	"account_id" integer,
	"installments" integer,
	"type" "type" NOT NULL,
	"category_id" integer NOT NULL,
	"payday" timestamp,
	"paid_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "families" (
	"id" serial PRIMARY KEY NOT NULL,
	"serial" varchar(26) NOT NULL,
	"name" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "family_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"family_id" serial NOT NULL,
	"is_owner" boolean DEFAULT false,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
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
CREATE TABLE "users_profile" (
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
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cards" ADD CONSTRAINT "cards_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cards" ADD CONSTRAINT "cards_family_id_families_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."families"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entries" ADD CONSTRAINT "entries_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entries" ADD CONSTRAINT "entries_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "family_members" ADD CONSTRAINT "family_members_family_id_families_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."families"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "family_members" ADD CONSTRAINT "family_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_profile" ADD CONSTRAINT "users_profile_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "account_serial_index" ON "accounts" USING btree ("serial");--> statement-breakpoint
CREATE INDEX "account_user_id_index" ON "accounts" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "card_serial_index" ON "cards" USING btree ("serial");--> statement-breakpoint
CREATE INDEX "user_id_index" ON "cards" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "family_member_user_id_index" ON "family_members" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "family_member_family_id_index" ON "family_members" USING btree ("family_id");--> statement-breakpoint
CREATE UNIQUE INDEX "profile_serial_index" ON "users_profile" USING btree ("serial");--> statement-breakpoint
CREATE UNIQUE INDEX "profile_user_id_index" ON "users_profile" USING btree ("user_id");
