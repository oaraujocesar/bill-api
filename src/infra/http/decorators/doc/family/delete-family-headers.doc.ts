import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiParam } from '@nestjs/swagger'
import { BadRequestResponse } from '../shared/bad-request-response.decorator'

export function DeleteFamilyDoc() {
	return applyDecorators(
		ApiOperation({
			summary: 'deletes family details',
		}),
		ApiParam({
			name: 'serial',
			description: 'Serial of the family',
			type: String,
		}),
		BadRequestResponse({ errorMessage: 'Family not found.' }),
	)
}
