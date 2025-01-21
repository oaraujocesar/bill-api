import { Module } from '@nestjs/common'
import { ACCOUNT_REPOSITORY, CARD_REPOSITORY, CATEGORY_REPOSITORY, USER_REPOSITORY } from 'src/shared/tokens'
import { DrizzleModule } from './drizzle/drizzle.module'
import { AccountDrizzleRepository } from './drizzle/repositories/account.drizzle.repository'
import { CardDrizzleRepository } from './drizzle/repositories/card.drizzle.repository'
import { CategoryDrizzleRepository } from './drizzle/repositories/category.drizzle.repository'
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
		{
			provide: CARD_REPOSITORY,
			useClass: CardDrizzleRepository,
		},
		{
			provide: CATEGORY_REPOSITORY,
			useClass: CategoryDrizzleRepository,
		},
	],
	exports: [USER_REPOSITORY, ACCOUNT_REPOSITORY, CARD_REPOSITORY, CATEGORY_REPOSITORY],
})
export class DatabaseModule {}
