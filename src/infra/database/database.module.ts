import { Module } from '@nestjs/common'
import { USER_REPOSITORY } from 'src/shared/tokens'
import { DrizzleModule } from './drizzle/drizzle.module'
import { UserDrizzleRepository } from './drizzle/repositories/user.drizzle.repository'

@Module({
	imports: [DrizzleModule],
	providers: [
		{
			provide: USER_REPOSITORY,
			useClass: UserDrizzleRepository,
		},
	],
	exports: [USER_REPOSITORY],
})
export class DatabaseModule {}
