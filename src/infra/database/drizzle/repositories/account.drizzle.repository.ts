import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Account } from 'src/application/entities/account'
import { AccountRepository } from 'src/application/repositories/account.repository'
import { DRIZZLE } from '../drizzle.module'
import { AccountMapper } from '../mapper/account-mapper'
import * as schema from '../schema'

@Injectable()
export class AccountDrizzleRepository implements AccountRepository {
	private readonly logger = new Logger(AccountDrizzleRepository.name)

	constructor(@Inject(DRIZZLE) private readonly database: NodePgDatabase<typeof schema>) {}

	async saveAccount(account: Account): Promise<Account> {
		const drizzleAccount = AccountMapper.toDrizzle(account)

		try {
			const [savedAccount] = await this.database.insert(schema.account).values(drizzleAccount).returning().execute()

			return AccountMapper.toDomain(savedAccount)
		} catch (error) {
			this.logger.error(error)
			throw new InternalServerErrorException()
		}
	}
}
