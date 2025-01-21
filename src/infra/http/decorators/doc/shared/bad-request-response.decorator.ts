import { HttpStatus } from '@nestjs/common'
import { ApiBadRequestResponse } from '@nestjs/swagger'
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface'

export const BadRequestResponse = ({
	errorMessage,
	errors,
}: {
	errorMessage?: string
	errors?: Record<string, string>[] | Array<string>
} = {}) => {
	let errorsProperties: { [key: string]: SchemaObject } = {}

	if (errors) {
		errorsProperties = errors.reduce((acc: Record<string, SchemaObject>, error) => {
			const [key, value] = Object.entries(error)[0]
			acc[key] = {
				type: 'string',
				example: value,
			} as SchemaObject
			return acc
		}, {})
	}

	const errorsDetails: { errors: SchemaObject } = {
		errors: {},
	}

	if (errors?.at(0) && typeof errors.at(0) === 'object') {
		errorsDetails.errors = {
			type: 'array',
			items: {
				type: 'object',
				properties: errorsProperties,
			},
		}
	}

	if (errors?.at(0) && typeof errors.at(0) === 'string') {
		errorsDetails.errors.items = {
			type: 'string',
			example: errors.at(0),
		} as SchemaObject
	}

	return ApiBadRequestResponse({
		description: 'Bad request',
		schema: {
			type: 'object',
			properties: {
				message: {
					type: 'string',
					example: errorMessage,
				} as SchemaObject,
				statusCode: {
					type: 'number',
					example: HttpStatus.BAD_REQUEST,
				} as SchemaObject,
				...errorsDetails,
			},
		},
	})
}
