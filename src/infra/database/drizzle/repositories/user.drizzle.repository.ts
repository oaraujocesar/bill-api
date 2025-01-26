import { HttpStatus, Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { UserProfile } from 'src/application/entities/user-profile.entity'
import { User } from 'src/application/entities/user.entity'
import { UserRepository } from 'src/application/repositories/user.repository'
import { Exception } from 'src/shared/exceptions/custom.exception'
import { DRIZZLE } from '../drizzle.module'
import { UserMapper } from '../mapper/user-mapper'
import { UserProfileMapper } from '../mapper/user-profile-mapper'
import * as schema from '../schema'

@Injectable()
export class UserDrizzleRepository implements UserRepository {
	private readonly logger = new Logger(UserDrizzleRepository.name)

	constructor(@Inject(DRIZZLE) private readonly database: NodePgDatabase<typeof schema>) {}

	async findByEmail(email: string): Promise<User | null> {
		try {
			const result = await this.database.query.users.findFirst({
				where: eq(schema.users.email, email),
			})

			if (!result) return null

			return UserMapper.toDomain(result)
		} catch (error) {
			this.logger.error(error.stack)
			throw new InternalServerErrorException()
		}
	}

	async findProfileByUserId(userId: string): Promise<UserProfile | null> {
		try {
			const result = await this.database.query.usersProfile.findFirst({
				where: eq(schema.usersProfile.userId, userId),
			})

			return result ? UserProfileMapper.toDomain(result) : null
		} catch (error) {
			this.logger.error(error.stack)
			throw new InternalServerErrorException()
		}
	}

	async findById(id: string): Promise<User | null> {
		try {
			const result = await this.database.query.users.findFirst({
				where: eq(schema.users.id, id),
			})

			return result ? UserMapper.toDomain(result) : null
		} catch (error) {
			this.logger.error(error.stack)
			throw new InternalServerErrorException()
		}
	}

	async saveProfile(userProfileEntity: UserProfile): Promise<UserProfile> {
		const userProfileDrizzle = UserProfileMapper.toDrizzle(userProfileEntity)
		try {
			const [result] = await this.database.insert(schema.usersProfile).values(userProfileDrizzle).returning().execute()

			return UserProfileMapper.toDomain(result)
		} catch (error) {
			throw new Exception({
				error,
				errors: [{ code: 'BILL-501' }],
				message: 'Internal Server Error',
				statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
			})
		}
	}
}
