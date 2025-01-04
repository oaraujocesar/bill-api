import { applyDecorators } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiProperty } from '@nestjs/swagger'
import { BadRequestResponse } from '../shared/bad-request-response.decorator'
import { Family } from 'src/application/entities/family.entity'

class OkResponse {
	@ApiProperty({ type: Family })
	data: Family

	@ApiProperty()
	statusCode: number

	@ApiProperty()
	message: string
}

export function ShowFamilyDoc() {
	return applyDecorators(
		ApiOperation({
			summary: 'show family details',
			description: 'Show details for a non deleted family',
		}),
		ApiOkResponse({
			description: 'Family found.',
			type: OkResponse,
		}),
		BadRequestResponse({ errorMessage: 'Family not found.' }),
	)
}
