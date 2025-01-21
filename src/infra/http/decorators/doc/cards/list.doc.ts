import { applyDecorators } from '@nestjs/common'
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiProperty } from '@nestjs/swagger'
import { Card } from 'src/application/entities/card.entity'

class CardOkResponse {
	@ApiProperty({ type: [Card] })
	data: Card[]

	@ApiProperty()
	message: string
}

export function ListCardsDoc() {
	return applyDecorators(
		ApiOperation({
			summary: 'List cards',
			description: 'List all cards',
		}),
		ApiOkResponse({
			description: 'Cards listed successfully',
			type: CardOkResponse,
		}),
		ApiNotFoundResponse({
			description: 'No cards found',
			schema: { type: 'object', properties: { message: { type: 'string', example: 'Cards not found!' } } },
		}),
	)
}
