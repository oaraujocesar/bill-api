import { HttpStatus, Logger } from '@nestjs/common'
import { DateTime } from 'luxon'
import { Account } from 'src/application/entities/account.entity'
import { Entry, EntryType } from 'src/application/entities/entry.entity'
import { BaseUseCase } from 'src/application/interfaces/use-case.interface'
import { AccountRepository } from 'src/application/repositories/account.repository'
import { CategoryRepository } from 'src/application/repositories/category.repository'
import { TransactionRepository } from 'src/application/repositories/transactions.repository'
import { AccountRepo } from 'src/infra/database/drizzle/decorators/account.repository'
import { CategoryRepo } from 'src/infra/database/drizzle/decorators/category.repository'
import { Transactions } from 'src/infra/database/drizzle/decorators/transactions.repository'
import { Exception } from 'src/shared/exceptions/custom.exception'
import { ResponseBody, buildResponse } from 'src/shared/utils/build-response'

type CreateEntryUseCaseInput = {
	accountSerial: string
	categoryId: number
	amount: number
	title: string
	entryType: keyof typeof EntryType
	installments: number
	description: string
	userId: string
	payday: DateTime
}

export class CreateEntryUseCase implements BaseUseCase {
	constructor(
		@Transactions() private readonly transaction: TransactionRepository,
		@AccountRepo() private readonly accountRepository: AccountRepository,
		@CategoryRepo() private readonly categoryRepository: CategoryRepository,
	) {}

	private readonly logger = new Logger(CreateEntryUseCase.name)

	private validateSufficientBalance(account: Account, amount: number): void {
		if (!account || amount <= 0) {
			throw new Exception({
				message: 'Invalid account or amount',
				statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
			})
		}

		if (account.balance < amount) {
			throw new Exception({
				message: 'Insufficient funds',
				statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
			})
		}
	}

	async execute({
		accountSerial,
		title,
		categoryId,
		amount,
		userId,
		entryType,
		description,
		installments,
		payday,
	}: CreateEntryUseCaseInput): Promise<ResponseBody<Entry>> {
		this.logger.debug(`creating entry for user ${userId}`)

		const account = await this.accountRepository.findBySerial(accountSerial)
		if (!account) {
			this.logger.error(`account ${accountSerial} not found`)
			throw new Exception({
				message: 'Account not found!',
				statusCode: HttpStatus.NOT_FOUND,
			})
		}

		const category = await this.categoryRepository.findById(categoryId)
		if (!category) {
			this.logger.error(`category ${categoryId} not found`)
			throw new Exception({
				message: 'Category not found!',
				statusCode: HttpStatus.NOT_FOUND,
			})
		}

		if (category?.userId && category.userId !== userId) {
			this.logger.error(`category ${categoryId} does not belong to user ${userId}`)
			throw new Exception({
				message: 'Category not found!',
				statusCode: HttpStatus.NOT_FOUND,
			})
		}

		if (entryType === EntryType.EXPENSE) {
			this.validateSufficientBalance(account, amount)
		}

		const entry = Entry.create({
			amount,
			categoryId,
			description,
			type: entryType,
			installments,
			paidAt: payday.toJSDate(),
			payday: payday.toJSDate(),
			title,
		})

		const savedEntry = await this.transaction.createEntry({ entry, account })

		return buildResponse({
			statusCode: HttpStatus.CREATED,
			data: savedEntry,
			message: `${entryType} created successfully`,
		})
	}
}
