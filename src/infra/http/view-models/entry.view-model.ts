import { ApiProperty } from '@nestjs/swagger'
import { Entry, EntryType } from 'src/application/entities/entry.entity'

type EntryObject = {
	serial: string
	title: string
	description: string
	amount: number
	installments?: number
	type: 'income' | 'expense'
	category_id?: number
	category_name?: string
	category_icon?: string
	payday: string
	paid_at?: string
	created_at: string
	updated_at: string
}

export class EntryViewModel {
	@ApiProperty()
	serial: string

	@ApiProperty()
	title: string

	@ApiProperty()
	description: string

	@ApiProperty()
	amount: number

	@ApiProperty()
	installments?: number

	@ApiProperty({ enum: Object.values(EntryType) })
	type: EntryType

	@ApiProperty()
	category_id?: number

	@ApiProperty()
	category_name?: string

	@ApiProperty()
	category_icon?: string

	@ApiProperty()
	payday: Date

	@ApiProperty()
	paid_at?: Date

	@ApiProperty()
	created_at: Date

	@ApiProperty()
	updated_at: Date

	static toHTTP(entry: Entry) {
		let object: EntryObject = {
			serial: entry.serial,
			title: entry.title,
			description: entry.description,
			amount: entry.amount,
			installments: entry.installments,
			type: entry.type,
			category_id: entry.categoryId,
			payday: entry.payday.toISO(),
			paid_at: entry.paidAt.toISO(),
			created_at: entry.createdAt.toISO(),
			updated_at: entry.updatedAt.toISO(),
		}

		if (entry.category) {
			const { category_id, ...rest } = object
			object = { ...rest, category_name: entry.category.name, category_icon: entry.category.iconName }
		}

		return object
	}
}
