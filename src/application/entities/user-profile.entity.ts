import { DateTime } from 'luxon'
import { BaseEntity } from './helpers/base.entity'

export type UserProfileProps = {
	id?: number
	serial?: string
	name: string
	surname: string
	userId: string
	birthDate: Date
	createdAt?: Date
	updatedAt?: Date
}

export class UserProfile extends BaseEntity {
	name: string

	surname: string

	userId: string

	birthDate: DateTime

	constructor(props: UserProfileProps) {
		super({
			id: props.id,
			serial: props.serial,
			createdAt: props.createdAt,
			updatedAt: props.updatedAt,
		})
		this.name = props.name
		this.surname = props.surname
		this.userId = props.userId
		this.birthDate = DateTime.fromJSDate(props.birthDate)
	}

	static create(props: UserProfileProps): UserProfile {
		return new UserProfile(props)
	}
}
