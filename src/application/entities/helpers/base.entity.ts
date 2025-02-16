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
	id?: number

	serial: string

	createdAt?: DateTime

	updatedAt?: DateTime

	deletedAt?: DateTime

	constructor(props: BaseEntityProps) {
		this.id = props.id
		this.serial = props.serial ?? ulid()
		this.createdAt = props.createdAt ? DateTime.fromJSDate(props.createdAt) : DateTime.now()
		this.updatedAt = props.updatedAt ? DateTime.fromJSDate(props.updatedAt) : DateTime.now()
		this.deletedAt = props.deletedAt ? DateTime.fromJSDate(props.deletedAt) : undefined
	}
}
