import { HttpStatus, applyDecorators } from '@nestjs/common'
import { ApiCreatedResponse, ApiOperation, ApiProperty } from '@nestjs/swagger'
import { CardViewModel } from 'src/infra/http/view-models/card.view-model'
import { BadRequestResponse } from '../shared/bad-request-response.decorator'

class CreatedCardResponse {
	@ApiProperty({ type: CardViewModel })
	data: CardViewModel

	@ApiProperty({ example: HttpStatus.CREATED })
	statusCode: number

	@ApiProperty({ example: 'Card created!' })
	message: string
}

export function CreateCardDoc() {
	return applyDecorators(
		ApiOperation({
			summary: 'Create a card',
			description: 'Create a credit card for an user',
		}),
		ApiCreatedResponse({
			description: 'Card creation',
			type: CreatedCardResponse,
		}),
		BadRequestResponse({ errorMessage: 'User not found' }),
	)
}
