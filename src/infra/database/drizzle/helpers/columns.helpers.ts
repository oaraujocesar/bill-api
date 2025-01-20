import { timestamp } from 'drizzle-orm/pg-core'

export const timestamps = {
	updatedAt: timestamp('updated_at')
		.$onUpdateFn(() => new Date())
		.defaultNow()
		.notNull(),
	createdAt: timestamp().defaultNow().notNull(),
	deletedAt: timestamp(),
}
