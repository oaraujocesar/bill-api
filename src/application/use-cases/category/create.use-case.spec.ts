import { TestBed } from '@automock/jest'
import { faker } from '@faker-js/faker'
import { HttpStatus } from '@nestjs/common'
import { Category } from 'src/application/entities/category.entity'
import { CategoryRepository } from 'src/application/repositories/category.repository'
import { CATEGORY_REPOSITORY } from 'src/shared/tokens'
import { CreateCategoriesUseCase } from './create.use-case'

jest.mock('@nestjs/common/services/logger.service')

describe('CreateCategoryUseCase', () => {
	let useCase: CreateCategoriesUseCase
	let categoryRepository: jest.Mocked<CategoryRepository>

	beforeEach(() => {
		const { unit, unitRef } = TestBed.create(CreateCategoriesUseCase).compile()

		useCase = unit
		categoryRepository = unitRef.get<CategoryRepository>(CATEGORY_REPOSITORY)
	})

	it('should create a category', async () => {
		const category = Category.create({
			name: faker.lorem.word(),
			iconName: faker.lorem.word(),
			userId: faker.string.uuid(),
		})
		categoryRepository.upsert.mockResolvedValue(category)

		const { data, statusCode, message } = await useCase.execute({
			name: category.name,
			iconName: category.iconName,
			userId: category.userId,
		})

		expect(data).toBeInstanceOf(Category)
		expect(statusCode).toBe(HttpStatus.CREATED)
		expect(message).toBe('Category created successfully!')
		expect(categoryRepository.upsert).toHaveBeenCalledTimes(1)
	})
})
