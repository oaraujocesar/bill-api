import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { and, eq, isNull } from 'drizzle-orm'
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

	async listCardsByUserId(userId: string): Promise<Card[]> {
		try {
			const userCards = await this.database.query.cards.findMany({
				where: and(eq(cards.userId, userId), isNull(cards.deletedAt)),
			})

			return userCards.map(CardsMapper.toDomain)
		} catch (error) {
			this.logger.error(error.stack)

			throw new InternalServerErrorException()
		}
	}

	async saveCard(card: Card): Promise<Card> {
		try {
			const [savedCard] = await this.database
				.insert(cards)
				// @ts-expect-error type is not working properly
				.values({
					name: card.name,
					limit: card.limit,
					serial: card.serial,
					userId: card.userId,
					dueDate: card.dueDate,
					familyId: card.familyId,
				})
				.returning()
				.execute()

			return CardsMapper.toDomain(savedCard)
		} catch (error) {
			this.logger.error(error.stack)

			throw new InternalServerErrorException()
		}
	}
}
