import { relations, sql } from 'drizzle-orm'
import { decimal, index, pgTable, serial, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core'
import { timestamps } from '../helpers/columns.helpers'
import user from './users.schema'

const accounts = pgTable(
	'accounts',
	{
		id: serial('id').primaryKey(),
		serial: varchar('serial', { length: 26 }).notNull(),
		name: varchar('name').notNull(),
		balance: decimal('balance', { precision: 10, scale: 2 }).default(sql`0.00`).notNull(),
		userId: uuid('user_id')
			.references(() => user.id, { onDelete: 'cascade' })
			.notNull(),
		...timestamps,
	},
	(table) => [uniqueIndex('account_serial_index').on(table.serial), index('account_user_id_index').on(table.userId)],
)

export const accountsRelations = relations(accounts, ({ one }) => ({
	user: one(user, { fields: [accounts.userId], references: [user.id] }),
}))

export default accounts
