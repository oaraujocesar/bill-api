import { relations } from 'drizzle-orm'
import { boolean, pgSchema, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import userProfile from './user-profile.schema'

const authSchema = pgSchema('auth')

const user = authSchema.table('users', {
	id: uuid('id').primaryKey(),
	email: varchar('email').unique().notNull(),
	emailConfirmedAt: timestamp('email_confirmed_at'),
	isSuperAdmin: boolean('is_super_admin').default(false),
})

export const userRelations = relations(user, ({ one }) => ({
	profile: one(userProfile),
}))

export default user
