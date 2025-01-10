import { TestBed } from '@automock/jest'
import { faker } from '@faker-js/faker/.'
import { HttpStatus } from '@nestjs/common'
import { Card } from 'src/application/entities/card.entity'
import { CardRepository } from 'src/application/repositories/card.repository'
import { CARD_REPOSITORY } from 'src/shared/tokens'
import { ResponseBody } from 'src/shared/utils/build-response'
import { ListCardsUseCase } from './list.use-case'

describe('List cards use case', () => {
	let useCase: ListCardsUseCase
	let cardRepository: jest.Mocked<CardRepository>

	beforeEach(() => {
		const { unit, unitRef } = TestBed.create(ListCardsUseCase).compile()

		useCase = unit
		cardRepository = unitRef.get(CARD_REPOSITORY)
	})

	it('should list all non deleted cards', async () => {
		const userId = faker.string.uuid()

		cardRepository.listCardsByUserId.mockResolvedValue(
			Array.from(
				{ length: 5 },
				() =>
					new Card({
						dueDate: faker.number.int({ max: 31 }),
						name: faker.company.name(),
						limit: faker.number.float({ fractionDigits: 2, min: 1, max: 5000 }),
						userId,
						id: faker.number.int(),
					}),
			),
		)

		const { data, errors, message, statusCode } = (await useCase.execute(userId)) as ResponseBody<Card[]>

		expect(data).toHaveLength(5)
		expect(errors).toBeUndefined()
		expect(message).toEqual('Users cards.')
		expect(statusCode).toEqual(HttpStatus.OK)
		expect(cardRepository.listCardsByUserId).toHaveBeenCalledTimes(1)
		expect(cardRepository.listCardsByUserId).toHaveBeenCalledWith(userId)
		for (const card of data) {
			expect(card).toBeInstanceOf(Card)
		}
	})

	it('should return a message when no cards are found', async () => {
		const userId = faker.string.uuid()

		cardRepository.listCardsByUserId.mockResolvedValue([])

		const { data, errors, message, statusCode } = await useCase.execute(userId)

		expect(data).toBeUndefined()
		expect(errors).toBeUndefined()
		expect(message).toEqual('No cards found!')
		expect(statusCode).toEqual(HttpStatus.OK)
	})
})
