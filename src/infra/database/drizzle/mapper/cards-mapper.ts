import { Card } from 'src/application/entities/card.entity'

export type DrizzleCard = {
	id: number
	name: string
	serial: string
	userId: string
	createdAt: Date
	updatedAt: Date
	deletedAt: Date
	limit: string
	dueDate: number
}

export class CardsMapper {
	static toDomain(drizzleCard: DrizzleCard) {
		return Card.create({
			id: drizzleCard.id,
			serial: drizzleCard.serial,
			name: drizzleCard.name,
			dueDate: drizzleCard.dueDate,
			limit: Number(drizzleCard.limit),
			userId: drizzleCard.userId,
			createdAt: drizzleCard.createdAt,
			updatedAt: drizzleCard.updatedAt,
			deletedAt: drizzleCard.deletedAt,
		})
	}
}
