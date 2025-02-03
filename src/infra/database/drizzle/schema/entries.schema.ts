import { relations, sql } from 'drizzle-orm'
import { decimal, integer, pgEnum, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { timestamps } from '../helpers/columns.helpers'
import accounts from './accounts.schema'
import categories from './categories.schema'

export const entryType = pgEnum('type', ['income', 'expense'])

const entries = pgTable('entries', {
	id: serial().primaryKey(),
	serial: varchar('serial', { length: 26 }).notNull(),
	title: varchar().notNull(),
	description: text(),
	amount: decimal('amount', { precision: 10, scale: 2 }).default(sql`0.00`).notNull(),
	accountId: integer().references(() => accounts.id, { onDelete: 'cascade' }),
	installments: integer(),
	type: entryType().notNull(),
	categoryId: integer()
		.references(() => categories.id, { onDelete: 'no action' })
		.notNull(),
	/*invoiceId: integer().references(() => invoice.id, { onDelete: 'cascade' }), */
	payday: timestamp(),
	paidAt: timestamp(),
	...timestamps,
})

export const entriesRelations = relations(entries, ({ one }) => ({
	account: one(accounts, { fields: [entries.accountId], references: [accounts.id] }),
	category: one(categories, { fields: [entries.categoryId], references: [categories.id] }),
	/*invoice: one(entries, { fields: [entries.invoiceId], references: [entries.id] }),*/
}))

export default entries
