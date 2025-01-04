import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { ULID } from 'ulidx'
import { DRIZZLE } from '../drizzle.module'
import * as schema from '../schema'
import { FamilyRepository } from 'src/application/repositories/family.repository'
import { Family } from 'src/application/entities/family.entity'
import { FamilyMapper } from '../mapper/family-mapper'
import families from '../schema/family.schema'
import { eq } from 'drizzle-orm'

@Injectable()
export class FamilyDrizzleRepository implements FamilyRepository {
  private readonly logger = new Logger(FamilyDrizzleRepository.name)

  constructor(@Inject(DRIZZLE) private readonly database: NodePgDatabase<typeof schema>) { }
  async findBySerial(serial: string): Promise<Family | null> {
    try {
      const result = await this.database.query.families.findFirst({
        where: eq(families.serial, serial),
      })

      return result ? FamilyMapper.toDomain(result) : null
    } catch (error) {
      this.logger.error(error)
      throw new InternalServerErrorException()
    }
  }

  async delete(serial: ULID): Promise<void> {
    try {
      await this.database.delete(families).where(eq(families.serial, serial)).execute()
    } catch (error) {
      this.logger.error(error)
      throw new InternalServerErrorException()
    }
  }

  async save(family: Family): Promise<Family> {
    const drizzleFamily = FamilyMapper.toDrizzle(family)

    try {
      const [savedFamily] = await this.database.insert(families).values(drizzleFamily).returning().execute()

      return FamilyMapper.toDomain(savedFamily)
    } catch (error) {
      this.logger.error(error)
      throw new InternalServerErrorException()
    }
  }
}
