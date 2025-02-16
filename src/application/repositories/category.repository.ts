import { Category } from '../entities/category.entity'

export interface CategoryRepository {
	findById(id: number): Promise<Category>
	upsert(category: Category): Promise<Category>
	listByUserId(userId: string): Promise<Category[]>
}
