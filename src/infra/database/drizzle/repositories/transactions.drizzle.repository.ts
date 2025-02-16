import { Inject, Logger } from '@nestjs/common'
import { SQL, eq, sql } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Entry, EntryType } from 'src/application/entities/entry.entity'
import { CreateEntryRepositoryInput, TransactionRepository } from 'src/application/repositories/transactions.repository'
import { DRIZZLE } from '../drizzle.module'
import { CategoryMapper } from '../mapper/category-mapper'
import { EntryMapper } from '../mapper/entry-mapper'
import * as schema from '../schema'

export class TransactionsDrizzleRepository implements TransactionRepository {
	constructor(@Inject(DRIZZLE) private readonly database: NodePgDatabase<typeof schema>) {}

	private readonly logger = new Logger(TransactionsDrizzleRepository.name)

	async createEntry({ entry, account }: CreateEntryRepositoryInput): Promise<Entry> {
		const entryDrizzle = EntryMapper.toDrizzle(entry)

		return this.database.transaction(async (client) => {
			const [savedEntry] = await client
				.insert(schema.entries)
				// @ts-expect-error - TS complains about missing properties, but they are there
				.values({
					categoryId: entryDrizzle.categoryId,
					accountId: account.id,
					serial: entryDrizzle.serial,
					title: entryDrizzle.title,
					type: entryDrizzle.type,
					amount: entryDrizzle.amount,
					installments: entryDrizzle.installments,
					description: entryDrizzle.description,
					payday: entryDrizzle.payday,
					paidAt: entryDrizzle.paidAt,
				})
				.returning()
				.execute()

			if (account) {
				let amountToUpdate: SQL<unknown>
				switch (entry.type) {
					case EntryType.INCOME: {
						const sum = account.balance + entry.amount
						amountToUpdate = sql`${sum.toFixed(2)}`
						break
					}

					case EntryType.EXPENSE: {
						const sub = account.balance - entry.amount
						amountToUpdate = sql`${sub.toFixed(2)}`
						break
					}
				}

				await client
					.update(schema.accounts)
					// @ts-expect-error - TS complains about missing properties, but they are there
					.set({ balance: amountToUpdate })
					.where(eq(schema.accounts.id, account.id))
					.execute()
			}

			const [savedCategory] = await client
				.select()
				.from(schema.categories)
				.where(eq(schema.categories.id, savedEntry.categoryId))
				.execute()

			const category = CategoryMapper.toDomain(savedCategory)

			return EntryMapper.toDomain({ drizzleEntry: savedEntry, category })
		})
	}
}
