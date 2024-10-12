import { Inject, Injectable, Logger } from '@nestjs/common'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { UserProfile } from 'src/application/entities/user-profile'
import { UserRepository } from 'src/application/repositories/user.repository'
import { DRIZZLE } from '../drizzle.module'
import { UserProfileMapper } from '../mapper/user-profile-mapper'
import * as schema from '../schema'

@Injectable()
export class UserDrizzleRepository implements UserRepository {
	private readonly logger = new Logger(UserDrizzleRepository.name)

	constructor(@Inject(DRIZZLE) private readonly database: NodePgDatabase<typeof schema>) {}

	async saveProfile(userProfileEntity: UserProfile): Promise<UserProfile> {
		const userProfileDrizzle = UserProfileMapper.toDrizzle(userProfileEntity)
		try {
			const [result] = await this.database.insert(schema.userProfile).values(userProfileDrizzle).returning().execute()

			return UserProfileMapper.toDomain(result)
		} catch (error) {
			this.logger.error(error)
		}
	}
}
