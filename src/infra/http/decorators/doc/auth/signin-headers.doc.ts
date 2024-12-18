import { applyDecorators } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiOperation } from '@nestjs/swagger'
import { BadRequestResponse } from '../shared/bad-request-response.decorator'

export function SigninDoc() {
	return applyDecorators(
		ApiOperation({
			summary: 'Sign in',
			description: 'Sign in with email and password',
		}),
		ApiBody({
			schema: {
				type: 'object',
				properties: {
					email: {
						type: 'string',
						example: 'mzH8a@example.com',
					},
					password: {
						type: 'string',
						example: 'password',
					},
				},
			},
		}),
		ApiOkResponse({
			description: 'User created',
			schema: {
				type: 'object',
				properties: {
					data: {
						type: 'object',
						properties: {
							access_token: {
								type: 'string',
								example:
									'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjU0MzIxL2F1dGgvdjEiLCJzdWIiOiJkNjNjMDk0ZC1jMmRiLTRhODEtYjA1NS1hMWQxMDViZDdhNTkiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzMyMTQ2ODkwLCJpYXQiOjE3MzIxNDMyOTAsImVtYWlsIjoiY2Fpb2ZzckBwcm90b24ubWUiLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImVtYWlsIjoiY2Fpb2ZzckBwcm90b24ubWUiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsInBob25lX3ZlcmlmaWVkIjpmYWxzZSwic3ViIjoiZDYzYzA5NGQtYzJkYi00YTgxLWIwNTUtYTFkMTA1YmQ3YTU5In0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoicGFzc3dvcmQiLCJ0aW1lc3RhbXAiOjE3MzIxNDMyOTB9XSwic2Vzc2lvbl9pZCI6IjY3ZmJlNTc2LTUyNmEtNDU3My1hNDcwLWIzYjk4MWExM2RkOSIsImlzX2Fub255bW91cyI6ZmFsc2V9.Y7JThFnEmoGEeOHqi1eFrlSgUkGRCKGcVNtws7QeePI',
							},
							token_type: {
								type: 'string',
								example: 'bearer',
							},
							expire_in: {
								type: 'number',
								example: 3600,
							},
							expire_at: {
								type: 'number',
								example: 1732146890,
							},
							refresh_token: {
								type: 'string',
								example: 'okqYOl9ra3KXnRzR8j6jNQ',
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
		BadRequestResponse(),
		ApiBadRequestResponse({
			description: 'Bad request',
			schema: {
				type: 'object',
				properties: {
					message: {
						type: 'string',
						example: 'Invalid credentials',
					},
				},
			},
		}),
	)
}
