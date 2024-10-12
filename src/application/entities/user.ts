import { ApiProperty } from '@nestjs/swagger'

export type UserProps = {
	id: string
	email: string
	emailConfirmedAt: Date
	isSuperAdmin: boolean
}

export class User {
	@ApiProperty()
	id: string

	@ApiProperty()
	email: string

	@ApiProperty()
	emailConfirmedAt: Date

	@ApiProperty()
	isSuperAdmin: boolean

	constructor(props: UserProps) {
		this.id = props.id
		this.email = props.email
		this.emailConfirmedAt = props.emailConfirmedAt
		this.isSuperAdmin = props.isSuperAdmin
	}

	static create(props: UserProps): User {
		return new User(props)
	}
}
