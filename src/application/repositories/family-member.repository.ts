import { FamilyMember } from '../entities/family-member.entity'

export interface FamilyMemberRepository {
	save(family: FamilyMember): Promise<FamilyMember>
	delete(userId: FamilyMember): Promise<void>
	findByUserId(userId: string): Promise<FamilyMember>
	listByFamilySerial(familySerial: string): Promise<FamilyMember[]>
	findByUserAndFamilyId(userId: string, familyId: number): Promise<FamilyMember>
}
