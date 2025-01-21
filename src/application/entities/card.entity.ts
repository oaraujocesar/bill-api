import { ApiProperty } from '@nestjs/swagger'
import { ULID } from 'ulidx'
import { BaseEntity } from './helpers/base.entity'
import { User } from './user'

type CardProps = {
	id?: number
	name: string
	serial?: ULID
	limit: number
	dueDate: number
	userId: string
	user?: User
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

	user?: User

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
		this.user = props.user
	}

	static create(props: CardProps) {
		return new Card(props)
	}
}
