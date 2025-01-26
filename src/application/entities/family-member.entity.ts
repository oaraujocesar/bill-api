import { ApiProperty } from '@nestjs/swagger'
import { DateTime } from 'luxon'
import { UserProfile } from './user-profile.entity'

type FamilyMemberProps = {
	id?: number
	familyId: number
	isOwner?: boolean
	userId: string
	createdAt?: Date
}

export class FamilyMember {
	@ApiProperty()
	id: number

	@ApiProperty()
	userId: string

	@ApiProperty()
	familyId: number

	@ApiProperty()
	isOwner: boolean

	@ApiProperty()
	createdAt: DateTime

	userProfile?: UserProfile

	constructor(props: FamilyMemberProps) {
		this.id = props.id
		this.familyId = props.familyId
		this.userId = props.userId
		this.isOwner = props.isOwner
		this.createdAt = props.createdAt ? DateTime.fromJSDate(props.createdAt) : DateTime.now()
	}

	static create(props: FamilyMemberProps) {
		return new FamilyMember(props)
	}

	addUserProfile(userProfile: UserProfile) {
		this.userProfile = userProfile
	}
}
