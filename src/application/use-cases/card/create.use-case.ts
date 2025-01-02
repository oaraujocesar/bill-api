import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { Card } from 'src/application/entities/card.entity'
import { BaseUseCase } from 'src/application/interfaces/use-case.interface'
import { CardRepository } from 'src/application/repositories/card.repository'
import { UserAuthenticated } from 'src/infra/http/types/authenticated-request'
import { CARD_REPOSITORY } from 'src/shared/tokens'
import { buildResponse } from 'src/shared/utils/build-response'

type CreateUseCaseInput = {
	user: UserAuthenticated
	name: string
	limit: number
	dueDate: number
}

@Injectable()
export class CreateCardUseCase implements BaseUseCase {
	constructor(@Inject(CARD_REPOSITORY) private readonly cardRepository: CardRepository) {}

	async execute({ user, dueDate, limit, name }: CreateUseCaseInput) {
		let card = Card.create({ dueDate, limit, name, userId: user.id })

		card = await this.cardRepository.saveCard(card)

		return buildResponse({
			data: card,
			message: 'Card created!',
			statusCode: HttpStatus.CREATED,
		})
	}
}
