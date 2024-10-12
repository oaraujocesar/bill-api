import { ulid } from 'ulidx'

export type UserProfileProps = {
	id?: string
	serial?: string
	name: string
	surname: string
	userId: string
	birthDate: Date
	createdAt: Date
	updatedAt: Date
}

export class UserProfile {
	id?: string
	serial?: string
	name: string
	surname: string
	userId: string
	birthDate: Date
	createdAt: Date
	updatedAt: Date

	constructor(props: UserProfileProps) {
		this.id = props.id
		this.serial = props.serial ?? ulid()
		this.name = props.name
		this.surname = props.surname
		this.userId = props.userId
		this.birthDate = props.birthDate
		this.createdAt = props.createdAt
		this.updatedAt = props.updatedAt
	}

	static create(props: UserProfileProps): UserProfile {
		return new UserProfile(props)
	}
}
