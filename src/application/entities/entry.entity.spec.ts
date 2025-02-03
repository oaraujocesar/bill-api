import { faker } from '@faker-js/faker'
import { DateTime } from 'luxon'
import { isValid } from 'ulidx'
import { Entry, EntryProps, EntryType } from './entry.entity'

jest.mock('@nestjs/common/services/logger.service')

describe('EntryEntity', () => {
	it('should create entry', () => {
		const input: EntryProps = {
			id: faker.number.int(),
			createdAt: faker.date.recent(),
			updatedAt: faker.date.recent(),
			paidAt: faker.date.recent(),
			payday: faker.date.recent(),
			serial: faker.string.ulid(),
			accountId: faker.number.int(),
			amount: faker.number.float(),
			categoryId: faker.number.int(),
			description: faker.lorem.sentence(),
			installments: 0,
			title: faker.lorem.words(2),
			type: EntryType.EXPENSE,
		}

		const entry = Entry.create(input)
		expect(entry).toEqual(
			expect.objectContaining({
				id: input.id,
				createdAt: expect.any(DateTime),
				updatedAt: expect.any(DateTime),
				paidAt: expect.any(DateTime),
				payday: expect.any(DateTime),
				serial: input.serial,
				accountId: input.accountId,
				amount: input.amount,
				categoryId: input.categoryId,
				description: input.description,
				installments: input.installments,
				title: input.title,
				type: input.type,
			}),
		)
	})

	it('should create timestamps', () => {
		const input: EntryProps = {
			id: faker.number.int(),
			paidAt: faker.date.recent(),
			payday: faker.date.recent(),
			accountId: faker.number.int(),
			amount: faker.number.float(),
			categoryId: faker.number.int(),
			description: faker.lorem.sentence(),
			installments: 0,
			title: faker.lorem.words(2),
			type: EntryType.EXPENSE,
		}

		const entry = Entry.create(input)

		expect(entry).toMatchObject({
			...input,
			serial: expect.any(String),
			createdAt: expect.any(DateTime),
			updatedAt: expect.any(DateTime),
			paidAt: expect.any(DateTime),
			payday: expect.any(DateTime),
		})
		expect(isValid(entry.serial)).toBe(true)
	})
})
