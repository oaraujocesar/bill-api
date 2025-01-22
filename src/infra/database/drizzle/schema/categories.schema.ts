import { relations } from 'drizzle-orm'
import { pgTable, serial, uuid, varchar } from 'drizzle-orm/pg-core'
import { timestamps } from '../helpers/columns.helpers'
import user from './users.schema'

const categories = pgTable('categories', {
	id: serial().primaryKey(),
	name: varchar().notNull(),
	iconName: varchar().notNull(),
	userId: uuid().references(() => user.id, { onDelete: 'cascade' }),
	...timestamps,
})

export const categoriesRelations = relations(categories, ({ one }) => ({
	user: one(user, { fields: [categories.userId], references: [user.id] }),
}))

export default categories
