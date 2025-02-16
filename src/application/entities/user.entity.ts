import { UserProfile } from './user-profile.entity'

export type UserProps = {
	id: string
	email: string
	emailConfirmedAt: Date
	isSuperAdmin: boolean
	profile?: UserProfile
}

export class User {
	id: string

	email: string

	emailConfirmedAt: Date

	isSuperAdmin: boolean

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
