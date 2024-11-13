import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common'
import { ULID } from 'ulidx'

import { AccountRepository } from 'src/application/repositories/account.repository'
import { ErrorResponse } from 'src/application/types/error-response'
import { SuccessResponse } from 'src/application/types/success-response'
import { ACCOUNT_REPOSITORY } from 'src/shared/tokens'

type DeleteAccountResponse = SuccessResponse<void> | ErrorResponse

@Injectable()
export class DeleteAccountUseCase {
	private readonly logger = new Logger(DeleteAccountUseCase.name)

	constructor(@Inject(ACCOUNT_REPOSITORY) private readonly accountRepository: AccountRepository) {}

	async execute(serial: ULID): Promise<DeleteAccountResponse> {
		this.logger.debug('execution started')
		const account = await this.accountRepository.findBySerial(serial)

		if (!account) {
			this.logger.debug(`account with serial ${serial} not found`)

			return {
				data: {
					message: `account with serial ${serial} was not found.`,
					details: {
						code: 'BILL-404',
					},
				},
				status: HttpStatus.NOT_FOUND,
			}
		}

		await this.accountRepository.deleteAccount(serial)
		this.logger.debug('account deleted successfully')

		return {
			status: HttpStatus.NO_CONTENT,
		}
	}
}
