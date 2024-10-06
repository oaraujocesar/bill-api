import { randomUUID } from 'node:crypto'
import { ApiProperty } from '@nestjs/swagger'

export type UserProps = {
	id?: string
	name: string
    surname: string
    email: string
	password: string
	createdAt?: Date
	updatedAt?: Date
}

export class User {
	@ApiProperty()
	id: string

	@ApiProperty()
	name: string

    @ApiProperty()
    surname: string

    @ApiProperty()
    email: string

	@ApiProperty()
	password: string

	@ApiProperty()
	createdAt: Date

	@ApiProperty()
	updatedAt: Date

	constructor(props: UserProps) {
		this.id = props.id ?? randomUUID()
		this.name = props.name
		this.surname = props.surname
        this.email = props.email
		this.password = props.password
		this.createdAt = props.createdAt ?? new Date()
		this.updatedAt = props.updatedAt ?? new Date()
	}

	static create(props: UserProps): User {
		return new User(props)
	}
}
