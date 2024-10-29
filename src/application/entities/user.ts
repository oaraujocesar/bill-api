import { ApiProperty } from '@nestjs/swagger'
import { UserProfile } from './user-profile'

export type UserProps = {
	id: string
	email: string
	emailConfirmedAt: Date
	isSuperAdmin: boolean
	profile?: UserProfile
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

	@ApiProperty()
	profile?: UserProfile

	constructor(props: UserProps) {
		this.id = props.id
		this.email = props.email
		this.emailConfirmedAt = props.emailConfirmedAt
		this.isSuperAdmin = props.isSuperAdmin
		this.profile = props.profile
	}

	static create(props: UserProps): User {
		return new User(props)
	}
}
