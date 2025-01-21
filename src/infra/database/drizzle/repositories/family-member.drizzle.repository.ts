import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { and, eq } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { FamilyMember } from 'src/application/entities/family-member.entity'
import { FamilyMemberRepository } from 'src/application/repositories/family-member.repository'
import { DRIZZLE } from '../drizzle.module'
import { FamilyMemberMapper } from '../mapper/family-member-mapper'
import * as schema from '../schema'
import familyMembers from '../schema/family-member.schema'
import families from '../schema/family.schema'

@Injectable()
export class FamilyMemberDrizzleRepository implements FamilyMemberRepository {
	private readonly logger = new Logger(FamilyMemberDrizzleRepository.name)

	constructor(@Inject(DRIZZLE) private readonly database: NodePgDatabase<typeof schema>) {}

	async findByUserAndFamilyId(userId: string, familyId: number): Promise<FamilyMember> {
		try {
			const result = await this.database.query.familyMembers.findFirst({
				where: and(eq(familyMembers.userId, userId), eq(familyMembers.familyId, familyId)),
			})

			return result ? FamilyMemberMapper.toDomain({ familyMembers: result }) : null
		} catch (error) {
			this.logger.error(error)
			throw new InternalServerErrorException()
		}
	}

	async delete(userId: string): Promise<void> {
		try {
			await this.database.delete(familyMembers).where(eq(familyMembers.userId, userId)).execute()
		} catch (error) {
			this.logger.error(error)
			throw new InternalServerErrorException()
		}
	}

	async save(familyMember: FamilyMember): Promise<FamilyMember> {
		const drizzleFamilyMember = FamilyMemberMapper.toDrizzle(familyMember)

		try {
			const [savedFamilyMember] = await this.database
				.insert(familyMembers)
				.values(drizzleFamilyMember)
				.returning()
				.execute()

			return FamilyMemberMapper.toDomain({ familyMembers: savedFamilyMember })
		} catch (error) {
			this.logger.error(error)
			throw new InternalServerErrorException()
		}
	}

	async listByFamilySerial(familySerial: string): Promise<FamilyMember[]> {
		try {
			const result = await this.database
				.select({ familyMembers, userProfile: schema.usersProfile })
				.from(families)
				.leftJoin(familyMembers, eq(families.id, familyMembers.familyId))
				.leftJoin(schema.users, eq(familyMembers.userId, schema.users.id))
				.leftJoin(schema.usersProfile, eq(schema.users.id, schema.usersProfile.userId))
				.where(eq(families.serial, familySerial))
				.execute()

			return result.map(({ familyMembers, userProfile }) => FamilyMemberMapper.toDomain({ familyMembers, userProfile }))
		} catch (error) {
			this.logger.error(error.stack)
			throw new InternalServerErrorException()
		}
	}
}
