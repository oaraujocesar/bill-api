import { ApiProperty } from '@nestjs/swagger'
import { ULID } from 'ulidx'
import { BaseEntity } from './helpers/base.entity'

type FamilyProps = {
	id?: number
	name: string
	serial?: ULID
	createdAt?: Date
	updatedAt?: Date
	deletedAt?: Date
}

export class Family extends BaseEntity {
	@ApiProperty()
	name: string

	constructor(props: FamilyProps) {
		super({
			id: props.id,
			serial: props.serial,
			createdAt: props.createdAt,
			updatedAt: props.updatedAt,
			deletedAt: props.deletedAt,
		})

		this.name = props.name
	}

	static create(props: FamilyProps) {
		return new Family(props)
	}
}
