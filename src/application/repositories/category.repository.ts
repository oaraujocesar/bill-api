import { Category } from '../entities/category.entity'

export interface CategoryRepository {
	upsert(category: Category): Promise<Category>
}
