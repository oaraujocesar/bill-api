import { relations } from 'drizzle-orm'
import { boolean, pgSchema, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import accounts from './accounts.schema'
import cards from './cards.schema'
import categories from './categories.schema'
import familyMembers from './family-member.schema'
import usersProfile from './users-profile.schema'

export const authSchema = pgSchema('auth')

const user = authSchema.table('users', {
	id: uuid('id').primaryKey(),
	email: varchar('email').unique().notNull(),
	emailConfirmedAt: timestamp('email_confirmed_at'),
	isSuperAdmin: boolean('is_super_admin').default(false),
})

export const usersRelations = relations(user, ({ one, many }) => ({
	profile: one(usersProfile),
	accounts: many(accounts),
	cards: many(cards),
	categories: many(categories),
	familyMembers: many(familyMembers),
}))

export default user
