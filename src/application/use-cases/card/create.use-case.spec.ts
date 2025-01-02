import { TestBed } from '@automock/jest'
import { faker } from '@faker-js/faker'
import { HttpStatus } from '@nestjs/common'
import { Card } from 'src/application/entities/card.entity'
import { CardRepository } from 'src/application/repositories/card.repository'
import { CARD_REPOSITORY } from 'src/shared/tokens'
import { CreateCardUseCase } from './create.use-case'

jest.mock('@nestjs/common/services/logger.service')

describe('Create Card Use Case', () => {
	let useCase: CreateCardUseCase
	let cardRepository: jest.Mocked<CardRepository>

	beforeEach(async () => {
		const { unit, unitRef } = TestBed.create(CreateCardUseCase).compile()

		useCase = unit
		cardRepository = unitRef.get(CARD_REPOSITORY)
	})

	it('should create a card', async () => {
		const user = {
			id: faker.string.uuid(),
		}

		const card = {
			dueDate: faker.number.int({ max: 31 }),
			name: faker.company.name(),
			limit: faker.number.float({ fractionDigits: 2, min: 1, max: 5000 }),
		}

		const cardEntity = Card.create({ ...card, userId: user.id })

		cardRepository.saveCard.mockResolvedValue(cardEntity)

		const { data, errors, message, statusCode } = await useCase.execute({
			user,
			...card,
		})

		expect(data).toBeInstanceOf(Card)
		expect(data).toEqual(cardEntity)
		expect(errors).toBeUndefined()
		expect(message).toEqual('Card created!')
		expect(statusCode).toEqual(HttpStatus.CREATED)
		expect(cardRepository.saveCard).toHaveBeenCalledTimes(1)
	})
})
