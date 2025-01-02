import { HttpStatus } from '@nestjs/common'
import { ApiBadRequestResponse } from '@nestjs/swagger'

export const BadRequestResponse = ({
	errorMessage,
	errors,
}: { errorMessage: string; errors?: Record<string, string>[] }) => {
	let errorsProperties: { [key: string]: { type: string; example: string } } = {}

	if (errors) {
		errorsProperties = errors.reduce((acc: Record<string, { type: string; example: string }>, error) => {
			const [key, value] = Object.entries(error)[0]
			acc[key] = Object.assign({}, { type: 'string', example: value })
			return acc
		}, {})
	}

	const errorsDetails = errors
		? {
				errors: {
					type: 'array',
					items: {
						type: 'object',
						properties: errorsProperties,
					},
				},
			}
		: {}

	return ApiBadRequestResponse({
		description: 'Bad request',
		schema: {
			type: 'object',
			properties: {
				message: {
					type: 'string',
					example: errorMessage,
				},
				statusCode: {
					type: 'number',
					example: HttpStatus.BAD_REQUEST,
				},
				...errorsDetails,
			},
		},
	})
}
