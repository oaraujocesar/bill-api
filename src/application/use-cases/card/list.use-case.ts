import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common'
import { Card } from 'src/application/entities/card.entity'
import { BaseUseCase } from 'src/application/interfaces/use-case.interface'
import { CardRepository } from 'src/application/repositories/card.repository'
import { CARD_REPOSITORY } from 'src/shared/tokens'
import { ResponseBody, buildResponse } from 'src/shared/utils/build-response'

@Injectable()
export class ListCardsUseCase implements BaseUseCase {
	constructor(@Inject(CARD_REPOSITORY) private readonly cardRepository: CardRepository) {}

	private readonly logger = new Logger(ListCardsUseCase.name)

	async execute(userId: string): Promise<ResponseBody<Card[]>> {
		this.logger.debug('List cards use-case executed')
		const cards = await this.cardRepository.listCardsByUserId(userId)
		this.logger.debug(`Found ${cards.length} cards for user ${userId}`)
		if (!cards.length) {
			return buildResponse({ message: 'No cards found!', statusCode: HttpStatus.OK })
		}

		return buildResponse({ data: cards, message: 'Users cards.', statusCode: HttpStatus.OK })
	}
}
