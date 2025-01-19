import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common'
import { Account } from 'src/application/entities/account'
import { AccountRepository } from 'src/application/repositories/account.repository'
import { UserAuthenticated } from 'src/infra/http/types/authenticated-request'
import { ACCOUNT_REPOSITORY } from 'src/shared/tokens'
import { ResponseBody, buildResponse } from 'src/shared/utils/build-response'

@Injectable()
export class ListAccountsUseCase {
	constructor(@Inject(ACCOUNT_REPOSITORY) private readonly accountRepository: AccountRepository) {}

	private readonly logger = new Logger(ListAccountsUseCase.name)

	async execute(user: UserAuthenticated): Promise<ResponseBody<Account[]>> {
		const accounts = await this.accountRepository.listAllByUserId(user.id)

		this.logger.debug(`Found ${accounts.length} accounts for user ${user.id}`)

		if (!accounts.length) {
			return buildResponse({
				statusCode: HttpStatus.NO_CONTENT,
				message: 'No accounts found!',
			})
		}

		return buildResponse({
			data: accounts,
			statusCode: HttpStatus.OK,
			message: 'User accounts!',
		})
	}
}
