import { pgTable, serial, varchar } from 'drizzle-orm/pg-core'

const user = pgTable('users', {
	id: serial('id').primaryKey(),
	name: varchar('name').notNull(),
	surname: varchar('surname').notNull(),
	email: varchar('email').notNull().unique(),
})

export default user
