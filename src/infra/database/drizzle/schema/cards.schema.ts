import { relations, sql } from 'drizzle-orm'
import { decimal, index, integer, pgTable, serial, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core'
import { timestamps } from '../helpers/columns.helpers'
import families from './family.schema'
import user from './users.schema'

const cards = pgTable(
	'cards',
	{
		id: serial().primaryKey(),
		serial: varchar('serial', { length: 26 }).notNull(),
		name: varchar().notNull(),
		limit: decimal('limit', { precision: 10, scale: 2 }).default(sql`0.00`).notNull(),
		dueDate: integer().notNull(),
		userId: uuid()
			.references(() => user.id, { onDelete: 'cascade' })
			.notNull(),
		familyId: integer().references(() => families.id, { onDelete: 'cascade' }),
		...timestamps,
	},
	(table) => [uniqueIndex('card_serial_index').on(table.serial), index('user_id_index').on(table.userId)],
)

export const cardsRelations = relations(cards, ({ one }) => ({
	user: one(user, { fields: [cards.userId], references: [user.id] }),
	family: one(families, { fields: [cards.familyId], references: [families.id] }),
}))

export default cards
