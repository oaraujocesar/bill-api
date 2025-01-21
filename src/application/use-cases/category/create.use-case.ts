import { HttpStatus, Inject, Logger } from '@nestjs/common'
import { Category } from 'src/application/entities/category.entity'
import { BaseUseCase } from 'src/application/interfaces/use-case.interface'
import { CategoryRepository } from 'src/application/repositories/category.repository'
import { CATEGORY_REPOSITORY } from 'src/shared/tokens'
import { ResponseBody, buildResponse } from 'src/shared/utils/build-response'

type CreateCategoriesInput = {
	name: string
	iconName: string
	userId: string
}

type CreateCategoriesOutput = ResponseBody<Category>

export class CreateCategoriesUseCase implements BaseUseCase {
	constructor(@Inject(CATEGORY_REPOSITORY) private readonly categoryRepository: CategoryRepository) {}

	private readonly logger = new Logger(CreateCategoriesUseCase.name)

	async execute(props: CreateCategoriesInput): Promise<CreateCategoriesOutput> {
		const category = Category.create(props)

		const savedCategory = await this.categoryRepository.upsert(category)

		this.logger.debug(`Category created: ${JSON.stringify(savedCategory)}`)

		return buildResponse({
			data: savedCategory,
			statusCode: HttpStatus.CREATED,
			message: 'Category created successfully',
		})
	}
}
