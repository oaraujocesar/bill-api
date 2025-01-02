import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Card } from 'src/application/entities/card.entity'
import { CardRepository } from 'src/application/repositories/card.repository'
import { DRIZZLE } from '../drizzle.module'
import { CardsMapper } from '../mapper/cards-mapper'
import * as schema from '../schema'
import { cards } from '../schema'

@Injectable()
export class CardDrizzleRepository implements CardRepository {
	constructor(@Inject(DRIZZLE) private readonly database: NodePgDatabase<typeof schema>) {}

	private readonly logger = new Logger(CardDrizzleRepository.name)

	async saveCard(card: Card): Promise<Card> {
		try {
			const [savedCard] = await this.database
				.insert(cards)
				//@ts-expect-error type is not working properly
				.values({ dueDate: card.dueDate, name: card.name, serial: card.serial, userId: card.userId, limit: card.limit })
				.returning()
				.execute()

			return CardsMapper.toDomain(savedCard)
		} catch (error) {
			this.logger.error(error.stack)

			throw new InternalServerErrorException()
		}
	}
}
