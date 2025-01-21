import { applyDecorators } from '@nestjs/common'
import { ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiProperty } from '@nestjs/swagger'
import { Account } from 'src/application/entities/account'

class OkResponse {
	@ApiProperty({ type: [Account] })
	data: Account[]

	@ApiProperty()
	statusCode: number

	@ApiProperty()
	message: string
}

export function ListAccountsDoc() {
	return applyDecorators(
		ApiOperation({
			summary: 'List all accounts',
			description: 'List all non deleted accounts for user',
		}),
		ApiOkResponse({
			description: 'List of accounts',
			type: OkResponse,
		}),
		ApiNoContentResponse({ description: 'No accounts found' }),
	)
}
