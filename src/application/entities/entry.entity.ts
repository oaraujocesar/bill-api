import { DateTime } from 'luxon'
import { ULID } from 'ulidx'
import { Category } from './category.entity'
import { BaseEntity } from './helpers/base.entity'

export enum EntryType {
	INCOME = 'income',
	EXPENSE = 'expense',
}

type Type = 'income' | 'expense'

export type EntryProps = {
	id?: number
	serial?: ULID
	title: string
	description?: string
	amount: number
	accountId?: number
	installments?: number
	type: Type
	categoryId: number
	payday?: Date
	paidAt?: Date
	createdAt?: Date
	updatedAt?: Date
}

export class Entry extends BaseEntity {
	title: string
	description?: string
	amount: number
	accountId?: number
	installments?: number
	type: Type
	categoryId: number
	payday?: DateTime
	paidAt?: DateTime

	category: Category

	constructor(props: EntryProps) {
		super({
			id: props.id,
			serial: props.serial,
			createdAt: props.createdAt,
			updatedAt: props.updatedAt,
		})

		this.title = props.title
		this.description = props.description
		this.amount = props.amount
		this.accountId = props.accountId
		this.installments = props.installments
		this.type = props.type
		this.categoryId = props.categoryId
		this.payday = DateTime.fromJSDate(props.payday)
		this.paidAt = DateTime.fromJSDate(props.paidAt)
	}

	static create(props: EntryProps) {
		return new Entry(props)
	}

	addCategory(category: Category) {
		this.category = category
	}
}
