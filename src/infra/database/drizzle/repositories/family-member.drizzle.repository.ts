import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { FamilyMember } from 'src/application/entities/family-member.entity'
import { FamilyMemberRepository } from 'src/application/repositories/family-member.repository'
import { DRIZZLE } from '../drizzle.module'
import { FamilyMemberMapper } from '../mapper/family-member-mapper'
import * as schema from '../schema'
import familyMembers from '../schema/family-member.schema'

@Injectable()
export class FamilyMemberDrizzleRepository implements FamilyMemberRepository {
	private readonly logger = new Logger(FamilyMemberDrizzleRepository.name)

	constructor(@Inject(DRIZZLE) private readonly database: NodePgDatabase<typeof schema>) {}

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

			return FamilyMemberMapper.toDomain(savedFamilyMember)
		} catch (error) {
			this.logger.error(error)
			throw new InternalServerErrorException()
		}
	}

	async findByUserId(userId: string): Promise<FamilyMember> {
		try {
			const result = await this.database.query.familyMembers.findFirst({
				where: eq(familyMembers.userId, userId),
			})

			return FamilyMemberMapper.toDomain(result)
		} catch (error) {
			this.logger.error(error)
			throw new InternalServerErrorException()
		}
	}

	async listByFamilyId(familyId: number): Promise<FamilyMember[]> {
		try {
			const result = await this.database.query.familyMembers.findMany({
				where: eq(familyMembers.familyId, familyId),
			})

			return result.map(FamilyMemberMapper.toDomain)
		} catch (error) {
			this.logger.error(error)
			throw new InternalServerErrorException()
		}
	}
}
