import { Body, Controller, Get, Logger, Post, Res } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { CreateCardUseCase } from 'src/application/use-cases/card/create.use-case'
import { ListCardsUseCase } from 'src/application/use-cases/card/list.use-case'
import { CreateCardDoc } from '../decorators/doc/cards/create.doc'
import { User } from '../decorators/user.decorator'
import { CreateCardDto } from '../dtos/cards/create.dto'
import { UserAuthenticated } from '../types/authenticated-request'
import { CardViewModel } from '../view-models/card.view-model'

@Controller('cards')
@ApiTags('Cards')
@ApiBearerAuth()
export class CardsController {
	constructor(
		private readonly listCardsUseCase: ListCardsUseCase,
		private readonly createCardUseCase: CreateCardUseCase,
	) {}

	private readonly logger = new Logger(CardsController.name)

	@Get()
	async getCards(@User() user: UserAuthenticated, @Res() response: Response) {
		this.logger.debug('List cards controller executed')
		const { data, message, statusCode } = await this.listCardsUseCase.execute(user.id)

		return response.status(statusCode).json({ data: data.map(CardViewModel.toHTTP), message })
	}

	@Post()
	@CreateCardDoc()
	async createCard(@User() user: UserAuthenticated, @Body() body: CreateCardDto, @Res() response: Response) {
		this.logger.debug('Create card controller executed')
		const { data, message, statusCode } = await this.createCardUseCase.execute({
			user,
			...body,
		})

		return response.status(statusCode).json({ data, message })
	}
}
