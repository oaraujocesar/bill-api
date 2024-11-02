import { relations } from 'drizzle-orm'
import { decimal, pgTable, serial, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core'
import user from './user.schema'

const account = pgTable(
	'account',
	{
		id: serial('id').primaryKey(),
		serial: varchar('serial', { length: 26 }).notNull(),
		name: varchar('name').notNull(),
		balance: decimal('balance', { precision: 10, scale: 2 }).notNull(),
		userId: uuid('user_id')
			.references(() => user.id)
			.notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
		deletedAt: timestamp('deleted_at'),
	},
	(table) => ({
		serialIndex: uniqueIndex('account_serial_index').on(table.serial),
		userIdIndex: uniqueIndex('account_user_id_index').on(table.userId),
	}),
)

export const accountRelations = relations(account, ({ one }) => ({
	user: one(user, { fields: [account.userId], references: [user.id] }),
}))

export default account
