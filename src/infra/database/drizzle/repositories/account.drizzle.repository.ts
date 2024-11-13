import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { eq, sql } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { ULID } from 'ulidx'

import { Account } from 'src/application/entities/account'
import { AccountRepository } from 'src/application/repositories/account.repository'

import { DRIZZLE } from '../drizzle.module'
import { AccountMapper } from '../mapper/account-mapper'
import * as schema from '../schema'

@Injectable()
export class AccountDrizzleRepository implements AccountRepository {
	private readonly logger = new Logger(AccountDrizzleRepository.name)

	constructor(@Inject(DRIZZLE) private readonly database: NodePgDatabase<typeof schema>) {}

	async findBySerial(serial: string): Promise<Account | null> {
		try {
			const result = await this.database.query.account.findFirst({
				where: eq(schema.account.serial, serial),
			})

			return result ? AccountMapper.toDomain(result) : null
		} catch (error) {
			this.logger.error(error)
			throw new InternalServerErrorException()
		}
	}

	async deleteAccount(serial: ULID): Promise<void> {
		try {
			await this.database.update(schema.account).set({ deletedAt: sql`NOW()` }).where(eq(schema.account.serial, serial))
		} catch (error) {
			this.logger.error(error)
			throw new InternalServerErrorException()
		}
	}

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
