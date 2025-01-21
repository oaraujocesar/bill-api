import { TestBed } from '@automock/jest'
import { faker } from '@faker-js/faker'
import { HttpStatus } from '@nestjs/common'
import { Exception } from 'src/shared/exceptions/custom.exception'
import { SupabaseService } from 'src/shared/services/supabase.service'
import { RefreshTokenUseCase, RefreshTokenUseCaseInput } from './refresh-token.use-case'

jest.mock('@nestjs/common/services/logger.service')

describe('RefreshTokenUseCase', () => {
	let useCase: RefreshTokenUseCase
	let supabase: jest.Mocked<SupabaseService>

	beforeEach(() => {
		const { unit, unitRef } = TestBed.create(RefreshTokenUseCase).compile()

		useCase = unit
		supabase = unitRef.get(SupabaseService)
	})

	it('should be defined', () => {
		expect(useCase).toBeDefined()
	})

	it('should refresh token', async () => {
		const dto: RefreshTokenUseCaseInput = {
			refreshToken: faker.string.uuid(),
		}

		supabase.auth.refreshSession = jest.fn().mockResolvedValue({
			data: {
				session: {
					user: {
						id: faker.string.uuid(),
						email: faker.internet.email(),
					},
					access_token: faker.string.uuid(),
					refresh_token: faker.string.uuid(),
					expires_in: faker.number.int(),
					token_type: 'bearer',
				},
				user: {
					id: faker.string.uuid(),
					email: faker.internet.email(),
				},
			},
		})

		const { statusCode, data, message, errors } = await useCase.execute(dto)

		expect(statusCode).toBe(HttpStatus.CREATED)
		expect(errors).toBeUndefined()
		expect(message).toEqual('Token refreshed!')
		expect(data).toEqual({
			access_token: expect.any(String),
			refresh_token: expect.any(String),
			expires_in: expect.any(Number),
			token_type: 'bearer',
		})
	})

	it('should return error when refresh token is invalid', async () => {
		const dto: RefreshTokenUseCaseInput = {
			refreshToken: 'invalid token',
		}

		supabase.auth.refreshSession = jest.fn().mockResolvedValue({
			data: { session: {} },
			error: 'Is invalid token',
		})

		await expect(useCase.execute(dto)).rejects.toThrow(
			new Exception({
				message: 'Failed to refresh token',
				statusCode: HttpStatus.UNAUTHORIZED,
			}),
		)
	})
})
