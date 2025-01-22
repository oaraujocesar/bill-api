import { FamilyMember } from 'src/application/entities/family-member.entity'
import { UserProfile } from 'src/application/entities/user-profile'

export type DrizzleResultType = {
	id: number
	familyId: number
	userId: string
	isOwner: boolean
	createdAt: Date
}

export type DrizzleUserProfileResultType = {
	name: string
	serial: string
	id: number
	createdAt: Date
	updatedAt: Date
	userId: string
	surname: string
	birthDate: string
}

export class FamilyMemberMapper {
	static toDrizzle(familyMember: FamilyMember) {
		return {
			id: familyMember.id,
			familyId: familyMember.familyId,
			userId: familyMember.userId,
			isOwner: familyMember.isOwner,
			createdAt: familyMember.createdAt,
		}
	}

	static toDomain({
		familyMembers,
		userProfile,
	}: { familyMembers: DrizzleResultType; userProfile?: DrizzleUserProfileResultType }) {
		const familyMemberInstance = FamilyMember.create({
			id: familyMembers.id,
			familyId: familyMembers.familyId,
			userId: familyMembers.userId,
			createdAt: familyMembers.createdAt,
			isOwner: familyMembers.isOwner,
		})

		if (userProfile) {
			familyMemberInstance.addUserProfile(
				UserProfile.create({ ...userProfile, birthDate: new Date(userProfile.birthDate) }),
			)
		}

		return familyMemberInstance
	}
}
