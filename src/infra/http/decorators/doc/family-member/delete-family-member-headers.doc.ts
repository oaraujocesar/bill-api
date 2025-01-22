import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiParam } from '@nestjs/swagger'
import { BadRequestResponse } from '../shared/bad-request-response.decorator'

export function DeleteFamilyMemberDoc() {
	return applyDecorators(
		ApiOperation({
			summary: 'deletes a family member',
		}),
		ApiParam({
			name: 'familySerial',
			description: 'Serial of the family',
			type: String,
		}),
		ApiParam({
			name: 'serial',
			description: 'Serial of the member',
			type: String,
		}),
		BadRequestResponse({ errorMessage: 'Family member not found.' }),
	)
}
