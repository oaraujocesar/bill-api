import { Card } from '../entities/card.entity'

export interface CardRepository {
	saveCard(card: Card): Promise<Card>
}
