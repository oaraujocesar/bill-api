import { applyDecorators } from '@nestjs/common'
import { ApiBody, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger'
import { BadRequestResponse } from '../shared/bad-request-response.decorator'

export function SignupDoc() {
	return applyDecorators(
		ApiOperation({
			summary: 'Sign up',
			description: 'Sign up with email and password',
		}),
		ApiBody({
			schema: {
				type: 'object',
				properties: {
					email: {
						type: 'string',
						example: 'admin@billio.com.br',
					},
					password: {
						type: 'string',
						example: 'Mnbvcxz1!',
					},
					name: {
						type: 'string',
						example: 'John',
					},
					surname: {
						type: 'string',
						example: 'Doe',
					},
					birthDate: {
						type: 'string',
						example: '1990-01-01',
					},
				},
			},
		}),
		ApiCreatedResponse({
			description: 'User created',
			schema: {
				type: 'object',
				properties: {
					data: {
						type: 'object',
						properties: {
							id: {
								type: 'string',
								example: 'c12ac50b-73a0-411f-8cc4-388e244655c3',
							},
							email: {
								type: 'string',
								example: 'mzH8a@example.com',
							},
							emailConfirmedAt: {
								type: 'string',
								example: '2024-11-20T14:37:07.872Z',
							},
							isSuperAdmin: {
								type: 'boolean',
								example: false,
							},
							profile: {
								type: 'object',
								properties: {
									id: {
										type: 'number',
										example: 1,
									},
									serial: {
										type: 'string',
										example: '01JD502VA45N9HX79X1AZPHH7E',
									},
									name: {
										type: 'string',
										example: 'John',
									},
									surname: {
										type: 'string',
										example: 'Doe',
									},
									userId: {
										type: 'string',
										example: 'c12ac50b-73a0-411f-8cc4-388e244655c3',
									},
									birthDate: {
										type: 'string',
										example: '1990-01-01T00:00:00.000Z',
									},
									createdAt: {
										type: 'string',
										example: '2024-11-20T14:37:07.904Z',
									},
									updatedAt: {
										type: 'string',
										example: '2024-11-20T14:37:07.904Z',
									},
								},
							},
						},
					},
					message: {
						type: 'string',
						example: 'User created successfully',
					},
				},
			},
		}),
		BadRequestResponse({ errorMessage: 'User already exists' }),
	)
}
