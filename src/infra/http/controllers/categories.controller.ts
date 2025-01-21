import { Body, Controller, Logger, Post, Res } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { CreateCategoriesUseCase } from 'src/application/use-cases/category/create.use-case'
import { CreateCategoryDoc } from '../decorators/doc/category/create.doc'
import { User } from '../decorators/user.decorator'
import { CreateCategoryDto } from '../dtos/category/create.dto'
import { UserAuthenticated } from '../types/authenticated-request'
import { CategoryViewModel } from '../view-models/category.view-model'

@ApiBearerAuth()
@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
	constructor(private readonly createUseCase: CreateCategoriesUseCase) {}

	private readonly logger = new Logger(CategoriesController.name)

	@Post()
	@CreateCategoryDoc()
	async createCategory(@User() user: UserAuthenticated, @Body() body: CreateCategoryDto, @Res() res: Response) {
		this.logger.debug(`Creating category for user ${user.id} with body ${JSON.stringify(body)}`)

		const { data, errors, message, statusCode } = await this.createUseCase.execute({
			iconName: body.icon_name,
			name: body.name,
			userId: user.id,
		})

		return res.status(statusCode).json({ data: CategoryViewModel.toHTTP(data), errors, message })
	}
}
