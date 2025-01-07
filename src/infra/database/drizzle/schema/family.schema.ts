import { relations } from 'drizzle-orm'
import { index, pgTable, serial, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core'
import familyMember from './family-member.schema'
import user from './users.schema'

const families = pgTable(
	'families',
	{
		id: serial('id').primaryKey(),
		serial: varchar('serial', { length: 26 }).notNull(),
		name: varchar('name').notNull(),
		userId: uuid('user_id')
			.references(() => user.id)
			.notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
		deletedAt: timestamp('deleted_at'),
	},
	(table) => [uniqueIndex('family_serial_index').on(table.serial), index('family_user_id_index').on(table.userId)],
)

export const familiesRelations = relations(families, ({ one, many }) => ({
	user: one(user, { fields: [families.userId], references: [user.id] }),
	familyMember: many(familyMember),
}))

export default families
