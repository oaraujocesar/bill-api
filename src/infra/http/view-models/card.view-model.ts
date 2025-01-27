import { ApiProperty } from '@nestjs/swagger'
import { Card } from 'src/application/entities/card.entity'

export class CardViewModel {
	@ApiProperty()
	name: string

	@ApiProperty()
	limit: number

	@ApiProperty()
	serial: string

	@ApiProperty()
	user_id: string

	@ApiProperty()
	due_date: number

	@ApiProperty()
	created_at: Date

	@ApiProperty()
	updated_at: Date

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
