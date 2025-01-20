import { FamilyMember } from '../entities/family-member.entity'

export interface FamilyMemberRepository {
	save(family: FamilyMember): Promise<FamilyMember>
	delete(userId: string): Promise<void>
	listByFamilyId(familyId: number): Promise<FamilyMember[]>
	findByUserId(userId: string): Promise<FamilyMember>
}
