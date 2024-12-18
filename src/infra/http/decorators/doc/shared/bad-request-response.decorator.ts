import { ApiBadRequestResponse } from '@nestjs/swagger'

export const BadRequestResponse = () =>
	ApiBadRequestResponse({
		description: 'Bad request',
		schema: {
			type: 'object',
			properties: {
				message: {
					type: 'array',
					items: {
						type: 'string',
						example: 'password is not strong enough',
					},
				},
				error: {
					type: 'string',
					example: 'Bad Request',
				},
				status: {
					type: 'number',
					example: 400,
				},
			},
		},
	})
