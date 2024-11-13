import { Inject, Injectable, Logger } from '@nestjs/common'
import { Account } from 'src/application/entities/account'
import { AccountRepository } from 'src/application/repositories/account.repository'
import { ErrorResponse } from 'src/application/types/error-response'
import { SuccessResponse } from 'src/application/types/success-response'
import { ACCOUNT_REPOSITORY } from 'src/shared/tokens'

type CreateAccountRequest = {
	name: string
}

type CreateAccountResponse = SuccessResponse<Account> | ErrorResponse

@Injectable()
export class CreateAccountUseCase {
	private readonly logger = new Logger(CreateAccountUseCase.name)

	constructor(@Inject(ACCOUNT_REPOSITORY) private readonly accountRepository: AccountRepository) {}

	async execute({ name }: CreateAccountRequest, userId: string): Promise<CreateAccountResponse> {
		this.logger.debug('execution started')

		let account = Account.create({ name, userId, balance: 0 })

		account = await this.accountRepository.saveAccount(account)

		account.id = undefined

		this.logger.debug(`account created ${JSON.stringify(account)}`)

		return {
			data: account,
			status: 201,
		}
	}
}
