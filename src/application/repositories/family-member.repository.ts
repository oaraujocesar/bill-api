import { ULID } from 'ulidx'
import { FamilyMember } from '../entities/family-member.entity'

export interface FamilyMemberRepository {
  save(family: FamilyMember): Promise<FamilyMember>
  findBySerial(serial: ULID): Promise<FamilyMember | null>
  delete(serial: ULID): Promise<void>
  listByFamilyId(familyId: number): Promise<FamilyMember[]>
}
