import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common'
import { Card } from 'src/application/entities/card.entity'
import { BaseUseCase } from 'src/application/interfaces/use-case.interface'
import { CardRepository } from 'src/application/repositories/card.repository'
import { FamilyRepository } from 'src/application/repositories/family.repository'
import { FamilyRepo } from 'src/infra/database/drizzle/decorators/family.repository'
import { UserAuthenticated } from 'src/infra/http/types/authenticated-request'
import { Exception } from 'src/shared/exceptions/custom.exception'
import { CARD_REPOSITORY } from 'src/shared/tokens'
import { ResponseBody, buildResponse } from 'src/shared/utils/build-response'

type CreateUseCaseInput = {
	user: UserAuthenticated
	name: string
	limit: number
	dueDate: number
	familySerial?: string
}

@Injectable()
export class CreateCardUseCase implements BaseUseCase {
	constructor(
		@Inject(CARD_REPOSITORY) private readonly cardRepository: CardRepository,
		@FamilyRepo() private readonly familyRepository: FamilyRepository,
	) {}

	private readonly logger = new Logger(CreateCardUseCase.name)

	async execute({ user, dueDate, limit, name, familySerial }: CreateUseCaseInput): Promise<ResponseBody<Card>> {
		let familyId: number | undefined
		if (familySerial) {
			const family = await this.familyRepository.findBySerial(familySerial)

			if (!family) {
				throw new Exception({
					message: 'Family not found!',
					statusCode: HttpStatus.NOT_FOUND,
				})
			}

			this.logger.debug(`Creating card with family serial: ${familySerial}`)
			familyId = family.id
		}

		const card = await this.cardRepository.saveCard(
			Card.create({
				name,
				limit,
				dueDate,
				familyId,
				userId: user.id,
			}),
		)

		this.logger.debug(`Card created ${JSON.stringify(card)}`)

		return buildResponse({
			data: card,
			message: 'Card created!',
			statusCode: HttpStatus.CREATED,
		})
	}
}
