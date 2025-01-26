import { Body, Controller, Delete, Get, Logger, Param, Post, Req, Res } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { FastifyReply } from 'fastify'
import { CreateAccountUseCase } from 'src/application/use-cases/account/create'
import { DeleteAccountUseCase } from 'src/application/use-cases/account/delete'
import { ListAccountsUseCase } from 'src/application/use-cases/account/list-all'
import { ListAccountsDoc } from '../decorators/doc/accounts/list-accounts-headers.doc'
import { User } from '../decorators/user.decorator'
import { CreateAccountDto } from '../dtos/account/create-account.dto'
import { RequestWithUser, UserAuthenticated } from '../types/authenticated-request'
import { AccountViewModel } from '../view-models/account.view-model'

@ApiTags('Accounts')
@ApiBearerAuth()
@Controller('accounts')
export class AccountController {
	private readonly logger = new Logger(AccountController.name)

	constructor(
		private readonly createAccountUseCase: CreateAccountUseCase,
		private readonly deleteAccountUseCase: DeleteAccountUseCase,
		private readonly listAccountsUseCase: ListAccountsUseCase,
	) {}

	@Get()
	@ListAccountsDoc()
	async listAccounts(@Res() response: FastifyReply, @User() user: UserAuthenticated) {
		this.logger.debug('[ListAccounts]: called')

		const { data, statusCode, message } = await this.listAccountsUseCase.execute(user)

		return response.status(statusCode).send({ data: data.map(AccountViewModel.toHTTP), message })
	}

	@Post()
	@ApiOperation({ summary: 'Creates a bank account' })
	async createAccount(@Body() body: CreateAccountDto, @Res() response: FastifyReply, @Req() request: RequestWithUser) {
		this.logger.debug(`[createAccount]: called with body ${JSON.stringify(body)}`)

		const { data, statusCode, message } = await this.createAccountUseCase.execute(
			{ initialBalance: body.initial_balance, ...body },
			request.user.id,
		)

		return response.status(statusCode).send({ data: AccountViewModel.toHTTP(data), message })
	}

	@Delete(':serial')
	@ApiOperation({ summary: 'Deletes a bank account' })
	async deleteAccount(@Param('serial') serial: string, @Res() response: FastifyReply) {
		this.logger.debug(`[deleteAccount]: called for serial: ${serial}`)

		const { statusCode, message } = await this.deleteAccountUseCase.execute(serial)

		return response.status(statusCode).send({ message })
	}
}
