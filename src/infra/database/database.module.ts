import { Module } from '@nestjs/common'
import {
	ACCOUNT_REPOSITORY,
	CARD_REPOSITORY,
	CATEGORY_REPOSITORY,
	ENTRY_REPOSITORY,
	FAMILY_MEMBER_REPOSITORY,
	FAMILY_REPOSITORY,
	TRANSACTIONS_REPOSITORY,
	USER_REPOSITORY,
} from 'src/shared/tokens'
import { DrizzleModule } from './drizzle/drizzle.module'
import { AccountDrizzleRepository } from './drizzle/repositories/account.drizzle.repository'
import { CardDrizzleRepository } from './drizzle/repositories/card.drizzle.repository'
import { CategoryDrizzleRepository } from './drizzle/repositories/category.drizzle.repository'
import { EntryDrizzleRepository } from './drizzle/repositories/entry.drizzle.repository'
import { FamilyMemberDrizzleRepository } from './drizzle/repositories/family-member.drizzle.repository'
import { FamilyDrizzleRepository } from './drizzle/repositories/family.drizzle.repository'
import { TransactionsDrizzleRepository } from './drizzle/repositories/transactions.drizzle.repository'
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
		{
			provide: FAMILY_REPOSITORY,
			useClass: FamilyDrizzleRepository,
		},
		{
			provide: FAMILY_MEMBER_REPOSITORY,
			useClass: FamilyMemberDrizzleRepository,
		},
		{
			provide: TRANSACTIONS_REPOSITORY,
			useClass: TransactionsDrizzleRepository,
		},
		{
			provide: ENTRY_REPOSITORY,
			useClass: EntryDrizzleRepository,
		},
	],
	exports: [
		USER_REPOSITORY,
		ACCOUNT_REPOSITORY,
		CARD_REPOSITORY,
		FAMILY_REPOSITORY,
		FAMILY_MEMBER_REPOSITORY,
		CATEGORY_REPOSITORY,
		TRANSACTIONS_REPOSITORY,
	],
})
export class DatabaseModule {}
