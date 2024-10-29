import { ApiProperty } from '@nestjs/swagger'
import { ulid } from 'ulidx'

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

export class UserProfile {
	@ApiProperty()
	id?: number
	@ApiProperty()
	serial: string
	@ApiProperty()
	name: string
	@ApiProperty()
	surname: string
	@ApiProperty()
	userId: string
	@ApiProperty()
	birthDate: Date
	@ApiProperty()
	createdAt?: Date
	@ApiProperty()
	updatedAt?: Date

	constructor(props: UserProfileProps) {
		this.id = props.id
		this.serial = props.serial ?? ulid()
		this.name = props.name
		this.surname = props.surname
		this.userId = props.userId
		this.birthDate = props.birthDate
		this.createdAt = props.createdAt ?? new Date()
		this.updatedAt = props.updatedAt ?? new Date()
	}

	static create(props: UserProfileProps): UserProfile {
		return new UserProfile(props)
	}
}
