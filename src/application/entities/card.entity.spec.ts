import { faker } from '@faker-js/faker'
import { DateTime } from 'luxon'
import { Card, CardProps } from './card.entity'

describe('Card Entity', () => {
	it('should create card', () => {
		const input: CardProps = {
			id: faker.number.int(),
			serial: faker.string.ulid(),
			name: faker.company.name(),
			limit: faker.number.float({ min: 1, max: 5000, fractionDigits: 2 }),
			userId: faker.string.uuid(),
			dueDate: faker.number.int(31),
			createdAt: faker.date.recent(),
			updatedAt: faker.date.recent(),
			deletedAt: faker.date.recent(),
		}

		const card = Card.create(input)

		expect(card).toEqual(
			expect.objectContaining({
				id: input.id,
				serial: input.serial,
				name: input.name,
				limit: input.limit,
				userId: input.userId,
				dueDate: input.dueDate,
				createdAt: expect.any(DateTime),
				updatedAt: expect.any(DateTime),
				deletedAt: expect.any(DateTime),
			}),
		)
	})

	it('should generate serial and timestamps', () => {
		const input = {
			limit: faker.number.float({ min: 1, max: 5000 }),
			name: faker.company.name(),
			dueDate: faker.number.int(31),
			userId: faker.string.uuid(),
		}

		const card = Card.create(input)

		expect(card.createdAt).toStrictEqual(expect.any(DateTime))
		expect(card.updatedAt).toStrictEqual(expect.any(DateTime))
		expect(card.serial).toStrictEqual(expect.any(String))
	})
})
