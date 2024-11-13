import { TestBed } from '@automock/jest'
import { faker } from '@faker-js/faker/.'
import { HttpStatus } from '@nestjs/common'
import { User } from 'src/application/entities/user'
import { UserProfile } from 'src/application/entities/user-profile'
import { UserRepository } from 'src/application/repositories/user.repository'
import { CreateUserDto } from 'src/http/dtos/user/create-user.dto'
import { USER_REPOSITORY } from 'src/shared/tokens'
import { CreateUserUseCase } from './create'

jest.mock('@nestjs/common/services/logger.service')

describe('Create User Profile use case', () => {
	let useCase: CreateUserUseCase
	let userRepository: jest.Mocked<UserRepository>

	beforeEach(() => {
		const { unit, unitRef } = TestBed.create(CreateUserUseCase).compile()

		useCase = unit
		userRepository = unitRef.get<UserRepository>(USER_REPOSITORY)
	})

	it('should create user profile', async () => {
		const dto: CreateUserDto = {
			name: faker.person.firstName(),
			surname: faker.person.lastName(),
			birthDate: faker.date.past().toISOString(),
		}

		const userId = faker.string.uuid()
		userRepository.findById.mockResolvedValue(
			User.create({
				id: userId,
				email: faker.internet.email(),
				emailConfirmedAt: faker.date.past(),
				isSuperAdmin: faker.datatype.boolean(),
			}),
		)
		userRepository.saveProfile.mockResolvedValue(
			UserProfile.create({
				name: dto.name,
				surname: dto.surname,
				userId,
				birthDate: new Date(dto.birthDate),
			}),
		)

		const { data, status } = await useCase.execute(dto, faker.string.uuid())

		expect(data).toBeInstanceOf(UserProfile)
		expect(status).toBe(HttpStatus.CREATED)
	})

	it('should fail if user not found', async () => {
		const dto: CreateUserDto = {
			name: faker.person.firstName(),
			surname: faker.person.lastName(),
			birthDate: faker.date.past().toISOString(),
		}

		userRepository.findById.mockResolvedValue(null)

		const { data, status } = await useCase.execute(dto, faker.string.uuid())

		expect(data).toEqual({
			message: 'user is not able to create profile',
			details: {
				code: 'BILL-101',
			},
		})
		expect(status).toBe(HttpStatus.UNAUTHORIZED)
		expect(userRepository.saveProfile).not.toHaveBeenCalled()
	})

	it('should fail if user profile already exists', async () => {
		const dto: CreateUserDto = {
			name: faker.person.firstName(),
			surname: faker.person.lastName(),
			birthDate: faker.date.past().toISOString(),
		}

		const userId = faker.string.uuid()
		userRepository.findById.mockResolvedValue(
			User.create({
				id: userId,
				email: faker.internet.email(),
				emailConfirmedAt: faker.date.past(),
				isSuperAdmin: faker.datatype.boolean(),
			}),
		)

		userRepository.findProfileByUserId.mockResolvedValue(
			UserProfile.create({
				name: dto.name,
				surname: dto.surname,
				userId,
				birthDate: new Date(dto.birthDate),
			}),
		)

		const { data, status } = await useCase.execute(dto, userId)

		expect(data).toEqual({
			message: 'user is not able to create profile',
			details: {
				code: 'BILL-102',
			},
		})
		expect(status).toBe(HttpStatus.UNAUTHORIZED)
		expect(userRepository.saveProfile).not.toHaveBeenCalled()
	})
})
