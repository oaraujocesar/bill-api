import { TestBed } from '@automock/jest'
import { faker } from '@faker-js/faker'
import { HttpStatus } from '@nestjs/common'
import { SupabaseErrors } from 'src/shared/enums/supabase-errors.enum'
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

		const { status, data } = await useCase.execute(dto)

		expect(status).toBe(HttpStatus.OK)
		expect(data.message).toEqual('User signed in successfully')
		expect(data.data).toEqual({
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
				code: SupabaseErrors.INVALID_CREDENTIALS,
			},
		})

		const { status, data } = await useCase.execute(dto)

		expect(status).toBe(HttpStatus.BAD_REQUEST)
		expect(data.message).toEqual('Invalid credentials')
	})

	it('should fail and return a different error from invalid credentials', async () => {
		const dto: SigninRequest = {
			email: faker.internet.email(),
			password: faker.internet.password(),
		}

		supabase.auth.signInWithPassword = jest.fn().mockResolvedValue({
			data: null,
			error: {
				code: faker.word.verb(),
			},
		})

		const { status, data } = await useCase.execute(dto)

		expect(status).toBe(HttpStatus.BAD_REQUEST)
		expect(data.message).toEqual('It was not possible to sign in')
		expect(data.details).toEqual({ code: 'BILL-203' })
	})
})
