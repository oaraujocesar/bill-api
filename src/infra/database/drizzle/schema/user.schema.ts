import { relations } from 'drizzle-orm'
import { boolean, pgSchema, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import account from './accounts.schema'
import userProfile from './user-profile.schema'

const authSchema = pgSchema('auth')

const user = authSchema.table('users', {
	id: uuid('id').primaryKey(),
	email: varchar('email').unique().notNull(),
	emailConfirmedAt: timestamp('email_confirmed_at'),
	isSuperAdmin: boolean('is_super_admin').default(false),
})

export const userRelations = relations(user, ({ one, many }) => ({
	profile: one(userProfile),
	accounts: many(account),
}))

export default user
