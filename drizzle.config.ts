import 'dotenv/config'

import { defineConfig } from 'drizzle-kit'

export default defineConfig({
	schema: './src/infra/database/drizzle/schema/index.ts',
	schemaFilter: ['public'],
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.DATABASE_URL ?? '',
	},
	verbose: true,
	strict: true,
})
