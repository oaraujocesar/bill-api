import { HttpStatus, Injectable } from '@nestjs/common'
import { Category } from 'src/application/entities/category.entity'
import { BaseUseCase } from 'src/application/interfaces/use-case.interface'
import { CategoryRepository } from 'src/application/repositories/category.repository'
import { CategoryRepo } from 'src/infra/database/drizzle/decorators/category.repository'
import { ResponseBody, buildResponse } from 'src/shared/utils/build-response'

type ListCategoriesUseCaseInput = {
	userId: string
}

@Injectable()
export class ListCategoriesUseCase implements BaseUseCase {
	constructor(@CategoryRepo() private readonly categoryRepository: CategoryRepository) {}

	async execute({ userId }: ListCategoriesUseCaseInput): Promise<ResponseBody<Category[]>> {
		const categories = await this.categoryRepository.listByUserId(userId)

		return buildResponse({ data: categories, statusCode: HttpStatus.OK, message: 'User categories!' })
	}
}
