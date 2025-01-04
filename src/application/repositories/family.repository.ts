import { ULID } from 'ulidx'
import { Family } from '../entities/family.entity'

export interface FamilyRepository {
  save(family: Family): Promise<Family>
  findBySerial(serial: string): Promise<Family | null>
  delete(serial: ULID): Promise<void>
}
