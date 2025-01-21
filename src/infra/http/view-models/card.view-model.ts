import { Card } from 'src/application/entities/card.entity'

export class CardViewModel {
	static toHTTP(card: Card) {
		return {
			name: card.name,
			limit: card.limit,
			serial: card.serial,
			user_id: card.userId,
			due_date: card.dueDate,
			created_at: card.createdAt,
			updated_at: card.updatedAt,
		}
	}
}
