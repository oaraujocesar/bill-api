import { FamilyMember } from 'src/application/entities/family-member.entity'

export type DrizzleResultType = {
	id: number
	serial: string
	familyId: number
	userId: string
	createdAt: Date
	updatedAt: Date
	deletedAt: Date
}

export class FamilyMemberMapper {
	static toDrizzle(familyMember: FamilyMember) {
		return {
			id: familyMember.id,
			serial: familyMember.serial,
			familyId: familyMember.familyId,
			userId: familyMember.userId,
			createdAt: familyMember.createdAt,
			updatedAt: familyMember.updatedAt,
			deletedAt: familyMember.deletedAt,
		}
	}

	static toDomain(family: DrizzleResultType) {
		return FamilyMember.create({
			id: family.id,
			serial: family.serial,
			familyId: family.familyId,
			userId: family.userId,
			createdAt: family.createdAt,
			updatedAt: family.updatedAt,
			deletedAt: family.deletedAt,
		})
	}
}
