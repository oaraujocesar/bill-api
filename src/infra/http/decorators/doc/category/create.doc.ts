import { HttpStatus, applyDecorators } from '@nestjs/common'
import { ApiCreatedResponse, ApiOperation, ApiProperty } from '@nestjs/swagger'
import { CategoryViewModel } from 'src/infra/http/view-models/category.view-model'
import { BadRequestResponse } from '../shared/bad-request-response.decorator'

class CreatedResponse {
	@ApiProperty({ type: CategoryViewModel })
	data: CategoryViewModel

	@ApiProperty()
	message: string

	@ApiProperty({ example: HttpStatus.CREATED })
	statusCode: number
}

export function CreateCategoryDoc() {
	return applyDecorators(
		ApiOperation({ description: 'Create a new category for an user' }),
		ApiCreatedResponse({ description: 'Category created', type: CreatedResponse }),
		BadRequestResponse({
			errorMessage: 'Bad request',
			errors: ['Name is required', 'Icon name is required'],
		}),
	)
}
