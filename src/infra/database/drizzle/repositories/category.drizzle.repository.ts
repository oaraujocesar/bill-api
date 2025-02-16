import { Inject, InternalServerErrorException, Logger } from '@nestjs/common'
import { and, eq, isNull, or } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Category } from 'src/application/entities/category.entity'
import { CategoryRepository } from 'src/application/repositories/category.repository'
import { DRIZZLE } from '../drizzle.module'
import { CategoryMapper } from '../mapper/category-mapper'
import * as schema from '../schema'
import { categories } from '../schema'

export class CategoryDrizzleRepository implements CategoryRepository {
	constructor(@Inject(DRIZZLE) private readonly database: NodePgDatabase<typeof schema>) {}

	private readonly logger = new Logger(CategoryDrizzleRepository.name)

	async findById(id: number): Promise<Category> {
		try {
			const drizzleCategory = await this.database.query.categories
				.findFirst({ where: and(eq(categories.id, id), isNull(categories.deletedAt)) })
				.execute()

			return drizzleCategory ? CategoryMapper.toDomain(drizzleCategory) : null
		} catch (error) {
			this.logger.error(error.stack)
			throw new InternalServerErrorException()
		}
	}

	async listByUserId(userId: string): Promise<Category[]> {
		try {
			const drizzleCategories = await this.database.query.categories
				.findMany({
					where: and(or(eq(categories.userId, userId), isNull(categories.userId)), isNull(categories.deletedAt)),
				})
				.execute()
			return drizzleCategories.map(CategoryMapper.toDomain)
		} catch (error) {
			this.logger.error(error.stack)
			throw new InternalServerErrorException()
		}
	}

	async upsert(category: Category): Promise<Category> {
		const drizzleCategory = CategoryMapper.toDrizzle(category)
		try {
			switch (!!drizzleCategory.id) {
				case true: {
					const [savedCategory] = await this.database
						.update(categories)
						.set(drizzleCategory)
						.where(eq(categories.id, drizzleCategory.id))
						.returning()
						.execute()
					return CategoryMapper.toDomain(savedCategory)
				}
				case false: {
					const [savedCategory] = await this.database.insert(categories).values(drizzleCategory).returning().execute()
					return CategoryMapper.toDomain(savedCategory)
				}
			}
		} catch (error) {
			this.logger.error(error.stack)
			throw new InternalServerErrorException()
		}
	}
}
