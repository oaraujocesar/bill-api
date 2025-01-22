import { FamilyMember } from 'src/application/entities/family-member.entity'

export class FamilyMemberViewModel {
	static toHTTP(familyMember: FamilyMember) {
		return {
			name: familyMember.userProfile.name,
			surname: familyMember.userProfile.surname,
			is_owner: familyMember.isOwner,
			created_at: familyMember.createdAt,
		}
	}
}
