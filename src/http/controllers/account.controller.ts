import { Body, Controller, Delete, Logger, Param, Post, Req, Res } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { CreateAccountUseCase } from 'src/application/use-cases/account/create'
import { DeleteAccountUseCase } from 'src/application/use-cases/account/delete'
import { ULID } from 'ulidx'
import { CreateAccountDto } from '../dtos/account/create-account.dto'
import { RequestWithUser } from '../types/authenticated-request'

@ApiTags('Accounts')
@Controller('accounts')
export class AccountController {
	private readonly logger = new Logger(AccountController.name)

	constructor(
		private readonly createAccountUseCase: CreateAccountUseCase,
		private readonly deleteAccountUseCase: DeleteAccountUseCase,
	) {}

	@Post()
	@ApiOperation({ summary: 'Creates a bank account' })
	async createAccount(@Body() body: CreateAccountDto, @Res() response: Response, @Req() request: RequestWithUser) {
		this.logger.debug(`[Create Account]: called with body ${JSON.stringify(body)}`)

		const { data, status } = await this.createAccountUseCase.execute(body, request.user.id)

		return response.status(status).json(data)
	}

	@Delete(':serial')
	@ApiOperation({ summary: 'Deletes a bank account' })
	async deleteAccount(@Param('serial') serial: string, @Res() response: Response) {
		this.logger.debug(`[Delete Account]: called for serial: ${serial}`)

		const { data, status } = await this.deleteAccountUseCase.execute(serial)

		return response.status(status).json(data)
	}
}
