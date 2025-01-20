import { relations } from 'drizzle-orm'
import { date, pgTable, serial, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core'
import user from './users.schema'

const usersProfile = pgTable(
	'users_profile',
	{
		id: serial('id').primaryKey(),
		serial: varchar('serial', { length: 26 }).notNull(),
		name: varchar('name').notNull(),
		surname: varchar('surname').notNull(),
		birthDate: date('birth_date').notNull(),
		userId: uuid('user_id')
			.references(() => user.id, { onDelete: 'cascade' })
			.notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
	},
	(table) => [
		uniqueIndex('profile_serial_index').on(table.serial),
		uniqueIndex('profile_user_id_index').on(table.userId),
	],
)

export const usersProfileRelations = relations(usersProfile, ({ one }) => ({
	user: one(user, { fields: [usersProfile.userId], references: [user.id] }),
}))

export default usersProfile
