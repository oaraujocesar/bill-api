import { ULID } from 'ulidx'
import { BaseEntity } from './helpers/base.entity'

export type CardProps = {
	id?: number
	name: string
	serial?: ULID
	limit: number
	dueDate: number
	userId: string
	familyId?: number
	createdAt?: Date
	updatedAt?: Date
	deletedAt?: Date
}

export class Card extends BaseEntity {
	name: string

	limit: number

	dueDate: number

	familyId: number

	userId: string

	constructor(props: CardProps) {
		super({
			id: props.id,
			serial: props.serial,
			createdAt: props.createdAt,
			updatedAt: props.updatedAt,
			deletedAt: props.deletedAt,
		})

		this.name = props.name
		this.limit = props.limit
		this.userId = props.userId
		this.dueDate = props.dueDate
		this.familyId = props.familyId
	}

	static create(props: CardProps) {
		return new Card(props)
	}
}
