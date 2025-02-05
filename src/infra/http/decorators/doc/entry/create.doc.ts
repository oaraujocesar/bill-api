import { HttpStatus, applyDecorators } from '@nestjs/common'
import { ApiCreatedResponse, ApiOperation, ApiProperty } from '@nestjs/swagger'
import { EntryViewModel } from 'src/infra/http/view-models/entry.view-model'
import { BadRequestResponse } from '../shared/bad-request-response.decorator'

class CreatedEntryResponse {
	@ApiProperty({ type: EntryViewModel })
	data: EntryViewModel

	@ApiProperty()
	message: string

	@ApiProperty({ example: HttpStatus.CREATED })
	statusCode: number
}

export function CreateEntryDoc() {
	return applyDecorators(
		ApiOperation({ description: 'Create a new entry' }),
		ApiCreatedResponse({ description: 'Entry created', type: CreatedEntryResponse }),
		BadRequestResponse({
			errorMessage: 'Bad request',
			errors: ['Title is required', 'amount is required', 'entry_type is required', 'category_id is required'],
		}),
	)
}
