import { TestBed } from '@automock/jest'
import { faker } from '@faker-js/faker'
import { HttpStatus } from '@nestjs/common'
import { Category } from 'src/application/entities/category.entity'
import { CategoryRepository } from 'src/application/repositories/category.repository'
import { CATEGORY_REPOSITORY } from 'src/shared/tokens'
import { ListCategoriesUseCase } from './list.use-case'

jest.mock('@nestjs/common/services/logger.service')

describe('ListCategoriesUseCase', () => {
	let useCase: ListCategoriesUseCase
	let categoryRepository: jest.Mocked<CategoryRepository>

	beforeEach(() => {
		const { unit, unitRef } = TestBed.create(ListCategoriesUseCase).compile()

		useCase = unit
		categoryRepository = unitRef.get<CategoryRepository>(CATEGORY_REPOSITORY)
	})

	it('should list categories', async () => {
		const userId = faker.string.uuid()

		const categories: Category[] = Array.from({ length: 4 }, () =>
			Category.create({
				name: faker.lorem.word(),
				iconName: faker.lorem.word(),
				userId,
				id: faker.number.int(50),
			}),
		)

		categoryRepository.listByUserId.mockResolvedValue(categories)

		const { data, statusCode, message } = await useCase.execute({ userId })

		expect(data).toHaveLength(4)
		expect(statusCode).toBe(HttpStatus.OK)
		expect(message).toBe('User categories!')
		expect(categoryRepository.listByUserId).toHaveBeenCalledTimes(1)
		expect(categoryRepository.listByUserId).toHaveBeenCalledWith(userId)
	})
})
