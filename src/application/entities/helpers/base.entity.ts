import { ApiProperty } from '@nestjs/swagger'
import { Exclude } from 'class-transformer'
import { DateTime } from 'luxon'
import { ULID, ulid } from 'ulidx'

type BaseEntityProps = {
	id?: number
	serial?: ULID
	createdAt?: Date
	updatedAt?: Date
	deletedAt?: Date
}

export class BaseEntity {
	@Exclude()
	@ApiProperty()
	id?: number
	@ApiProperty()
	serial: string
	@ApiProperty()
	createdAt?: DateTime
	@ApiProperty()
	updatedAt?: DateTime
	@ApiProperty()
	deletedAt?: DateTime

	constructor(props: BaseEntityProps) {
		this.id = props.id
		this.serial = props.serial ?? ulid()
		this.createdAt = props.createdAt ? DateTime.fromJSDate(props.createdAt) : DateTime.now()
		this.updatedAt = props.updatedAt ? DateTime.fromJSDate(props.updatedAt) : DateTime.now()
		this.deletedAt = props.deletedAt ? DateTime.fromJSDate(props.deletedAt) : undefined
	}
}
