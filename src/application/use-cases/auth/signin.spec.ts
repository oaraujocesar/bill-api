import { TestBed } from '@automock/jest'
import { faker } from '@faker-js/faker'
import { HttpStatus } from '@nestjs/common'
import { SupabaseErrors } from 'src/shared/enums/supabase-errors.enum'
import { Exception } from 'src/shared/exceptions/custom.exception'
import { SupabaseService } from 'src/shared/services/supabase.service'
import { SigninRequest, SigninUseCase } from './signin'

jest.mock('@nestjs/common/services/logger.service')

describe('Signin use case', () => {
	let useCase: SigninUseCase
	let supabase: jest.Mocked<SupabaseService>

	beforeEach(() => {
		const { unit, unitRef } = TestBed.create(SigninUseCase).compile()

		useCase = unit
		supabase = unitRef.get<SupabaseService>(SupabaseService)
	})

	it('should be defined', () => {
		expect(useCase).toBeDefined()
	})

	it('should signin user', async () => {
		const dto: SigninRequest = {
			email: faker.internet.email(),
			password: faker.internet.password(),
		}

		supabase.auth.signInWithPassword = jest.fn().mockResolvedValue({
			data: {
				user: {
					id: faker.string.uuid(),
					email: dto.email,
				},
				session: {
					access_token: faker.string.uuid(),
					refresh_token: faker.string.uuid(),
					expires_in: faker.number.int(),
					token_type: 'bearer',
				},
			},
		})

		const { statusCode, data, message } = await useCase.execute(dto)

		expect(statusCode).toBe(HttpStatus.OK)
		expect(message).toEqual('User signed in successfully!')
		expect(data).toEqual({
			access_token: expect.any(String),
			refresh_token: expect.any(String),
			expires_in: expect.any(Number),
			token_type: 'bearer',
		})
	})

	it('should fail if credentials is invalid', async () => {
		const dto: SigninRequest = {
			email: faker.internet.email(),
			password: faker.internet.password(),
		}

		supabase.auth.signInWithPassword = jest.fn().mockResolvedValue({
			data: null,
			error: {
				message: 'Invalid credentials!',
				status: HttpStatus.BAD_REQUEST,
				code: SupabaseErrors.INVALID_CREDENTIALS,
			},
		})

		await expect(useCase.execute(dto)).rejects.toThrow(
			new Exception({
				message: 'Invalid credentials!',
				statusCode: HttpStatus.BAD_REQUEST,
				errors: [{ code: 'BILL-202' }],
			}),
		)
	})
})
