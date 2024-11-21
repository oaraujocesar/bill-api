import { HttpStatus, Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { User } from 'src/application/entities/user'
import { UserProfile } from 'src/application/entities/user-profile'
import { UserRepository } from 'src/application/repositories/user.repository'
import { DRIZZLE } from '../drizzle.module'
import { UserMapper } from '../mapper/user-mapper'
import { UserProfileMapper } from '../mapper/user-profile-mapper'
import * as schema from '../schema'

@Injectable()
export class UserDrizzleRepository implements UserRepository {
	private readonly logger = new Logger(UserDrizzleRepository.name)

	constructor(@Inject(DRIZZLE) private readonly database: NodePgDatabase<typeof schema>) {}

	async findByEmail(email: string): Promise<User | null> {
		const result = await this.database.query.user.findFirst({
			where: eq(schema.user.email, email),
		})

		if (!result) return null

		return UserMapper.toDomain(result)
	}

	async findProfileByUserId(userId: string): Promise<UserProfile | null> {
		try {
			const result = await this.database.query.userProfile.findFirst({
				where: eq(schema.userProfile.userId, userId),
			})

			return result ? UserProfileMapper.toDomain(result) : null
		} catch (error) {
			this.logger.error(error)
			throw new InternalServerErrorException()
		}
	}

	async findById(id: string): Promise<User | null> {
		try {
			const result = await this.database.query.user.findFirst({
				where: eq(schema.user.id, id),
			})

			return result ? UserMapper.toDomain(result) : null
		} catch (error) {
			this.logger.error(error)
			throw new InternalServerErrorException()
		}
	}

	async saveProfile(userProfileEntity: UserProfile): Promise<UserProfile> {
		const userProfileDrizzle = UserProfileMapper.toDrizzle(userProfileEntity)
		try {
			const [result] = await this.database.insert(schema.userProfile).values(userProfileDrizzle).returning().execute()

			return UserProfileMapper.toDomain(result)
		} catch (error) {
			this.logger.error(error)
			throw new InternalServerErrorException({
				message: 'Internal Server Error',
				details: {
					code: 'BILL-501',
				},
				statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
			})
		}
	}
}
