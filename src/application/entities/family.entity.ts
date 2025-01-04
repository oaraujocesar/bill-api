import { } from 'node:crypto'
import { ApiProperty } from '@nestjs/swagger'
import { ULID } from 'ulidx'
import { BaseEntity } from './helpers/base.entity'
import { User } from './user'

type FamilyProps = {
	id?: number
	name: string
	serial?: ULID
	userId: string
	createdAt?: Date
	updatedAt?: Date
	deletedAt?: Date
	user?: User
}

export class Family extends BaseEntity {
	@ApiProperty()
	name: string

	@ApiProperty()
	userId: string

	@ApiProperty()
	user?: User

	constructor(props: FamilyProps) {
		super({
			id: props.id,
			serial: props.serial,
			createdAt: props.createdAt,
			updatedAt: props.updatedAt,
			deletedAt: props.deletedAt,
		})

		this.name = props.name
		this.userId = props.userId
		this.user = props.user
	}

	static create(props: FamilyProps) {
		return new Family(props)
	}
}
