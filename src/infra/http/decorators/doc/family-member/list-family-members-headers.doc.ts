import { applyDecorators } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiParam, ApiProperty } from '@nestjs/swagger'
import { FamilyMember } from 'src/application/entities/family-member.entity'
import { BadRequestResponse } from '../shared/bad-request-response.decorator'

class OkResponse {
	@ApiProperty({ type: [FamilyMember] })
	data: FamilyMember[]
	@ApiProperty()
	statusCode: number
	@ApiProperty()
	message: string
}

export function ListFamilyMembersDoc() {
	return applyDecorators(
		ApiOperation({
			summary: 'list all family members',
			description: 'List all family members',
		}),
		ApiParam({
			name: 'familySerial',
			description: 'Serial of the family',
			type: String,
		}),
		ApiOkResponse({
			description: 'Family members found.',
			type: OkResponse,
		}),
		BadRequestResponse({ errorMessage: 'Family members not found.' }),
	)
}
