import { faker } from '@faker-js/faker'
import { DateTime } from 'luxon'
import { Category, CategoryProps } from './category.entity'

jest.mock('@nestjs/common/services/logger.service')

describe('Category Entity', () => {
	it('should create category', () => {
		const input: CategoryProps = {
			id: faker.number.int(),
			name: faker.commerce.department(),
			iconName: faker.commerce.productMaterial(),
			userId: faker.string.uuid(),
			createdAt: new Date(),
			updatedAt: new Date(),
		}
		const category = Category.create(input)
		expect(category).toEqual(
			expect.objectContaining({
				id: input.id,
				name: input.name,
				iconName: input.iconName,
				userId: input.userId,
				createdAt: expect.any(DateTime),
				updatedAt: expect.any(DateTime),
			}),
		)
	})

	it('should generate timestamps', () => {
		const input = {
			name: faker.commerce.department(),
			iconName: faker.commerce.productMaterial(),
			userId: faker.string.uuid(),
		}
		const category = Category.create(input)
		expect(category.createdAt).toStrictEqual(expect.any(DateTime))
		expect(category.updatedAt).toStrictEqual(expect.any(DateTime))
	})
})
