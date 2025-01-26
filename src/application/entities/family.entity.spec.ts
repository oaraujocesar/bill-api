import { faker } from '@faker-js/faker/.'
import { DateTime } from 'luxon'
import { isValid } from 'ulidx'
import { Family } from './family.entity'

describe('Family entity', () => {
	it('should create a family', () => {
		const input = {
			id: faker.number.int(),
			serial: faker.string.ulid(),
			name: faker.person.lastName(),
			createdAt: faker.date.anytime(),
		}

		const family = Family.create(input)

		expect(family).toMatchObject({
			id: input.id,
			serial: input.serial,
			name: input.name,
			createdAt: expect.any(DateTime),
		})
	})

	it('should generate serial and timestamps', () => {
		const input = {
			name: faker.person.firstName(),
		}

		const family = Family.create(input)

		expect(family).toEqual(
			expect.objectContaining({
				...input,
				serial: expect.any(String),
				createdAt: expect.any(DateTime),
				updatedAt: expect.any(DateTime),
			}),
		)

		expect(isValid(family.serial)).toBe(true)
	})
})
