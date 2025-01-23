import { ApiProperty } from '@nestjs/swagger'
import { BaseEntity } from './helpers/base.entity'
import { User } from './user'

export type AccountProps = {
	id?: number
	serial?: string
	name: string
	balance: number
	userId: string
	createdAt?: Date
	updatedAt?: Date
	deletedAt?: Date
	user?: User
}

export class Account extends BaseEntity {
	@ApiProperty()
	name: string

	@ApiProperty()
	balance: number

	@ApiProperty()
	userId: string

	constructor(props: AccountProps) {
		super({
			id: props.id,
			serial: props.serial,
			createdAt: props.createdAt,
			updatedAt: props.updatedAt,
			deletedAt: props.deletedAt,
		})
		this.name = props.name
		this.userId = props.userId
		this.balance = props.balance
	}

	static create(props: AccountProps): Account {
		return new Account(props)
	}
}
