import { TestBed } from '@automock/jest'
import { faker } from '@faker-js/faker/.'
import { HttpStatus } from '@nestjs/common'
import { UserProfile } from 'src/application/entities/user-profile.entity'
import { User } from 'src/application/entities/user.entity'
import { UserRepository } from 'src/application/repositories/user.repository'
import { Exception } from 'src/shared/exceptions/custom.exception'
import { SupabaseService } from 'src/shared/services/supabase.service'
import { USER_REPOSITORY } from 'src/shared/tokens'
import { SignupRequest, SignupUseCase } from './signup'

jest.mock('@nestjs/common/services/logger.service')

describe('Signin use case', () => {
	let useCase: SignupUseCase
	let supabase: jest.Mocked<SupabaseService>
	let userRepository: jest.Mocked<UserRepository>

	beforeEach(() => {
		const { unit, unitRef } = TestBed.create(SignupUseCase).compile()

		useCase = unit
		supabase = unitRef.get<SupabaseService>(SupabaseService)
		userRepository = unitRef.get<UserRepository>(USER_REPOSITORY)
	})

	it('should be defined', () => {
		expect(useCase).toBeDefined()
	})

	it('should signup user', async () => {
		const dto: SignupRequest = {
			email: faker.internet.email(),
			password: faker.internet.password(),
			name: faker.person.firstName(),
			surname: faker.person.lastName(),
			birthDate: faker.date.past().toISOString(),
		}

		userRepository.findByEmail.mockResolvedValue(null)

		userRepository.saveProfile.mockResolvedValue(
			UserProfile.create({
				name: dto.name,
				surname: dto.surname,
				userId: faker.string.uuid(),
				birthDate: new Date(dto.birthDate),
			}),
		)

		supabase.auth.signUp = jest.fn().mockResolvedValue({
			data: {
				user: {
					id: faker.string.uuid(),
					email: dto.email,
				},
			},
		})

		const { statusCode, message } = await useCase.execute(dto)

		expect(statusCode).toBe(HttpStatus.CREATED)
		expect(message).toBe('User created successfully!')
		expect(supabase.auth.signUp).toHaveBeenCalledWith({ email: dto.email, password: dto.password })
		expect(userRepository.findByEmail).toHaveBeenCalledWith(dto.email)
		expect(userRepository.saveProfile).toHaveBeenCalledTimes(1)
	})

	it('should create a profile if user already exists', async () => {
		const dto: SignupRequest = {
			email: faker.internet.email(),
			password: faker.internet.password(),
			name: faker.person.firstName(),
			surname: faker.person.lastName(),
			birthDate: faker.date.past().toISOString(),
		}

		const user = {
			id: faker.string.uuid(),
			email: dto.email,
			emailConfirmedAt: faker.date.past(),
			isSuperAdmin: faker.datatype.boolean(),
		}

		userRepository.findByEmail.mockResolvedValue(User.create(user))

		userRepository.saveProfile.mockResolvedValue(
			UserProfile.create({
				name: dto.name,
				surname: dto.surname,
				userId: faker.string.uuid(),
				birthDate: new Date(dto.birthDate),
			}),
		)

		const { statusCode, message } = await useCase.execute(dto)

		expect(statusCode).toBe(HttpStatus.CREATED)
		expect(message).toBe('User created successfully!')
		expect(userRepository.findByEmail).toHaveBeenCalledWith(dto.email)
		expect(userRepository.saveProfile).toHaveBeenCalledTimes(1)
	})

	it('should throw if user already exists and has a profile', async () => {
		const dto: SignupRequest = {
			email: faker.internet.email(),
			password: faker.internet.password(),
			name: faker.person.firstName(),
			surname: faker.person.lastName(),
			birthDate: faker.date.past().toISOString(),
		}

		const user = {
			id: faker.string.uuid(),
			email: dto.email,
			emailConfirmedAt: faker.date.past(),
			isSuperAdmin: faker.datatype.boolean(),
		}

		const userProfile = {
			id: faker.number.int(),
			serial: faker.string.ulid(),
			name: dto.name,
			surname: dto.surname,
			userId: user.id,
			birthDate: faker.date.past(),
		}

		userRepository.findByEmail.mockResolvedValue(User.create(user))
		userRepository.findProfileByUserId.mockResolvedValue(UserProfile.create(userProfile))

		await expect(useCase.execute(dto)).rejects.toThrow(
			new Exception({ message: 'It was not possible to create the user!', statusCode: HttpStatus.BAD_REQUEST }),
		)
	})
})
