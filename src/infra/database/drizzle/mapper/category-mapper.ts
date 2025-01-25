import { Category } from 'src/application/entities/category.entity'

export type CategoryDrizzle = {
	id: number
	name: string
	iconName: string
	userId: string
	updatedAt: Date
	createdAt: Date
}

export class CategoryMapper {
	static toDrizzle(category: Category): CategoryDrizzle {
		return {
			id: category.id,
			name: category.name,
			iconName: category.iconName,
			userId: category.userId,
			updatedAt: category.updatedAt.toJSDate(),
			createdAt: category.createdAt.toJSDate(),
		}
	}

	static toDomain(categoryDrizzle: CategoryDrizzle): Category {
		return Category.create({
			id: categoryDrizzle.id,
			name: categoryDrizzle.name,
			iconName: categoryDrizzle.iconName,
			userId: categoryDrizzle.userId,
			updatedAt: categoryDrizzle.updatedAt,
			createdAt: categoryDrizzle.createdAt,
		})
	}
}
