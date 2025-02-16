import { Body, Controller, Logger, Post, Res } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { FastifyReply } from 'fastify'
import { DateTime } from 'luxon'
import { CreateEntryUseCase } from 'src/application/use-cases/entry/create.use-case'
import { CreateEntryDoc } from '../decorators/doc/entry/create.doc'
import { User } from '../decorators/user.decorator'
import { CreateEntryDto } from '../dtos/entry/create.dto'
import { UserAuthenticated } from '../types/authenticated-request'
import { EntryViewModel } from '../view-models/entry.view-model'

@Controller('/entries')
@ApiTags('Entries')
@ApiBearerAuth()
export class EntryController {
	constructor(private readonly createEntryUseCase: CreateEntryUseCase) {}

	private readonly logger = new Logger(EntryController.name)

	@Post()
	@CreateEntryDoc()
	async createEntry(@Body() body: CreateEntryDto, @User() user: UserAuthenticated, @Res() response: FastifyReply) {
		this.logger.debug(`Creating entry for user ${user.id} with body ${JSON.stringify(body)}`)

		const { data, errors, message, statusCode } = await this.createEntryUseCase.execute({
			accountSerial: body.account_serial,
			categoryId: body.category_id,
			amount: body.amount,
			title: body.title,
			entryType: body.entry_type,
			installments: body.installments,
			userId: user.id,
			payday: DateTime.fromISO(body.payday),
			description: body.description,
		})

		this.logger.debug(`Response: ${JSON.stringify(data)}`)

		return response.status(statusCode).send({ data: EntryViewModel.toHTTP(data), errors, message })
	}
}
