import { faker } from '@faker-js/faker'
import { Category, CategoryProps } from './category.entity'

describe('Category Entity', () => {
	it('should create category', () => {
		const input: CategoryProps = {
			id: faker.number.int(),
			name: faker.commerce.department(),
			iconName: faker.commerce.productMaterial(),
			userId: faker.string.uuid(),
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: new Date(),
		}
		const category = Category.create(input)
		expect(category).toEqual(
			expect.objectContaining({
				...input,
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
		expect(category.createdAt).toStrictEqual(expect.any(Date))
		expect(category.updatedAt).toStrictEqual(expect.any(Date))
	})
})
