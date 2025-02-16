import { Category } from 'src/application/entities/category.entity'
import { Entry } from 'src/application/entities/entry.entity'

type DrizzleEntry = {
	id: number
	title: string
	description: string
	amount: string
	installments: number
	type: 'INCOME' | 'EXPENSE'
	payday: Date
	categoryId: number
	serial: string
	createdAt: Date
	updatedAt: Date
	deletedAt: Date
	accountId: number
	paidAt: Date
}

export class EntryMapper {
	static toDomain({ drizzleEntry, category }: { drizzleEntry: DrizzleEntry; category?: Category }): Entry {
		const entry = Entry.create({
			id: drizzleEntry.id,
			title: drizzleEntry.title,
			description: drizzleEntry.description,
			amount: +drizzleEntry.amount,
			installments: drizzleEntry.installments,
			type: drizzleEntry.type,
			payday: drizzleEntry.payday,
			categoryId: drizzleEntry.categoryId,
			serial: drizzleEntry.serial,
			createdAt: drizzleEntry.createdAt,
			updatedAt: drizzleEntry.updatedAt,
			accountId: drizzleEntry.accountId,
			paidAt: drizzleEntry.paidAt,
		})

		if (category) {
			entry.addCategory(category)
		}

		return entry
	}

	static toDrizzle(entry: Entry): DrizzleEntry {
		return {
			title: entry?.title,
			description: entry?.description,
			amount: entry?.amount?.toFixed(2),
			installments: entry?.installments,
			type: entry?.type,
			payday: entry?.payday?.toJSDate(),
			categoryId: entry?.categoryId,
			serial: entry?.serial,
			createdAt: entry?.createdAt?.toJSDate(),
			updatedAt: entry?.updatedAt?.toJSDate(),
			deletedAt: entry?.deletedAt?.toJSDate(),
			accountId: entry?.accountId,
			paidAt: entry?.paidAt?.toJSDate(),
			id: entry?.id,
		}
	}
}
