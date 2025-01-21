import { ApiProperty } from '@nestjs/swagger'
import { Exclude } from 'class-transformer'
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
	createdAt?: Date
	@ApiProperty()
	updatedAt?: Date
	@ApiProperty()
	deletedAt?: Date

	constructor(props: BaseEntityProps) {
		this.id = props.id
		this.serial = props.serial ?? ulid()
		this.createdAt = props.createdAt ?? new Date()
		this.updatedAt = props.updatedAt ?? new Date()
		this.deletedAt = props.deletedAt
	}
}
