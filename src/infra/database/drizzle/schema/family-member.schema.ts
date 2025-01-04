import { relations } from 'drizzle-orm';
import { index, pgTable, serial, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core';
import user from './users.schema'
import family from './family.schema'

const familyMembers = pgTable(
  'family_members',
  {
    id: serial('id').primaryKey(),
    serial: varchar('serial', { length: 26 }).notNull(),
    familyId: serial('family_id')
      .references(() => family.id)
      .notNull(),
    userId: uuid('user_id')
      .references(() => user.id)
      .notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => [uniqueIndex('family_member_serial_index').on(table.serial), index('family_member_user_id_index').on(table.userId), index('family_member_family_id_index').on(table.familyId)],
)

export const familyMembersRelations = relations(familyMembers, ({ one }) => ({
  user: one(user, { fields: [familyMembers.userId], references: [user.id] }),
  family: one(family, { fields: [familyMembers.familyId], references: [family.id] }),
}))

export default familyMembers
