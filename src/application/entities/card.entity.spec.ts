import { faker } from '@faker-js/faker'
import { Card } from './card.entity'

describe('Card Entity', () => {
	it('should create card', () => {
		const input = {
			id: faker.number.int(),
			serial: faker.string.ulid(),
			name: faker.company.name(),
			limit: faker.number.float({ min: 1, max: 5000, fractionDigits: 2 }),
			userId: faker.string.uuid(),
			dueDate: faker.number.int(31),
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: new Date(),
		}

		const card = Card.create(input)

		expect(card).toEqual(
			expect.objectContaining({
				...input,
				_limit: input.limit,
				user: undefined,
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

		expect(card.createdAt).toStrictEqual(expect.any(Date))
		expect(card.updatedAt).toStrictEqual(expect.any(Date))
		expect(card.serial).toStrictEqual(expect.any(String))
	})
})
