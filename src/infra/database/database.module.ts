import { Module } from '@nestjs/common'
import { ACCOUNT_REPOSITORY, USER_REPOSITORY } from 'src/shared/tokens'
import { DrizzleModule } from './drizzle/drizzle.module'
import { AccountDrizzleRepository } from './drizzle/repositories/account.drizzle.repository'
import { UserDrizzleRepository } from './drizzle/repositories/user.drizzle.repository'

@Module({
	imports: [DrizzleModule],
	providers: [
		{
			provide: USER_REPOSITORY,
			useClass: UserDrizzleRepository,
		},
		{
			provide: ACCOUNT_REPOSITORY,
			useClass: AccountDrizzleRepository,
		},
	],
	exports: [USER_REPOSITORY, ACCOUNT_REPOSITORY],
})
export class DatabaseModule {}
