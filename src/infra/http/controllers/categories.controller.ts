import { Body, Controller, Get, Logger, Post, Res } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { FastifyReply } from 'fastify'
import { CreateCategoriesUseCase } from 'src/application/use-cases/category/create.use-case'
import { ListCategoriesUseCase } from 'src/application/use-cases/category/list.use-case'
import { CreateCategoryDoc } from '../decorators/doc/category/create.doc'
import { User } from '../decorators/user.decorator'
import { CreateCategoryDto } from '../dtos/category/create.dto'
import { UserAuthenticated } from '../types/authenticated-request'
import { CategoryViewModel } from '../view-models/category.view-model'

@ApiBearerAuth()
@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
	constructor(
		private readonly listUseCase: ListCategoriesUseCase,
		private readonly createUseCase: CreateCategoriesUseCase,
	) {}

	private readonly logger = new Logger(CategoriesController.name)

	@Get()
	async listCategories(@User() user: UserAuthenticated, @Res() res: FastifyReply) {
		this.logger.debug(`Listing categories for user ${user.id}`)

		const { data, errors, message, statusCode } = await this.listUseCase.execute({ userId: user.id })

		return res.status(statusCode).send({ data: data.map(CategoryViewModel.toHTTP), errors, message })
	}

	@Post()
	@CreateCategoryDoc()
	async createCategory(@User() user: UserAuthenticated, @Body() body: CreateCategoryDto, @Res() res: FastifyReply) {
		this.logger.debug(`Creating category for user ${user.id} with body ${JSON.stringify(body)}`)

		const { data, errors, message, statusCode } = await this.createUseCase.execute({
			iconName: body.icon_name,
			name: body.name,
			userId: user.id,
		})

		return res.status(statusCode).send({ data: CategoryViewModel.toHTTP(data), errors, message })
	}
}
