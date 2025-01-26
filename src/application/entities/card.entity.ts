import { ApiProperty } from '@nestjs/swagger'
import { ULID } from 'ulidx'
import { BaseEntity } from './helpers/base.entity'

export type CardProps = {
	id?: number
	name: string
	serial?: ULID
	limit: number
	dueDate: number
	userId: string
	createdAt?: Date
	updatedAt?: Date
	deletedAt?: Date
}

export class Card extends BaseEntity {
	@ApiProperty()
	name: string

	@ApiProperty()
	limit: number

	@ApiProperty()
	dueDate: number

	@ApiProperty()
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
		this.dueDate = props.dueDate
		this.userId = props.userId
	}

	static create(props: CardProps) {
		return new Card(props)
	}
}
