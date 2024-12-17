import { Body, Controller, Delete, Logger, Param, Post, Req, Res } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { CreateAccountUseCase } from 'src/application/use-cases/account/create'
import { DeleteAccountUseCase } from 'src/application/use-cases/account/delete'
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

		const { data, statusCode, message } = await this.createAccountUseCase.execute(body, request.user.id)

		return response.status(statusCode).json({ data, message })
	}

	@Delete(':serial')
	@ApiOperation({ summary: 'Deletes a bank account' })
	async deleteAccount(@Param('serial') serial: string, @Res() response: Response) {
		this.logger.debug(`[Delete Account]: called for serial: ${serial}`)

		const { data, statusCode, message } = await this.deleteAccountUseCase.execute(serial)

		return response.status(statusCode).json({ data, message })
	}
}
