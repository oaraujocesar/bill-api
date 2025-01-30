import { faker } from '@faker-js/faker'
import { Entry, EntryProps, EntryType } from './entry.entity'

jest.mock('@nestjs/common/services/logger.service')

describe('EntryEntity', () => {
	it('should create entry', () => {
		const input: EntryProps = {
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
})
