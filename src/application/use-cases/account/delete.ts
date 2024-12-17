import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common'
import { ULID } from 'ulidx'

import { AccountRepository } from 'src/application/repositories/account.repository'
import { ACCOUNT_REPOSITORY } from 'src/shared/tokens'
import { ResponseBody, buildResponse } from 'src/shared/utils/build-response'

@Injectable()
export class DeleteAccountUseCase {
	private readonly logger = new Logger(DeleteAccountUseCase.name)

	constructor(@Inject(ACCOUNT_REPOSITORY) private readonly accountRepository: AccountRepository) {}

	async execute(serial: ULID): Promise<ResponseBody<undefined>> {
		this.logger.debug('execution started')
		const account = await this.accountRepository.findBySerial(serial)

		if (!account) {
			this.logger.debug(`account with serial ${serial} not found`)

			return buildResponse({
				message: 'It was not possible to delete the account!',
				statusCode: HttpStatus.NOT_FOUND,
				errors: [{ code: 'BILL-204' }],
			})
		}

		await this.accountRepository.deleteAccount(serial)
		this.logger.debug('account deleted successfully')

		return buildResponse({
			statusCode: HttpStatus.NO_CONTENT,
			message: 'Account deleted successfully!',
		})
	}
}
