import { TestBed } from '@automock/jest'
import { faker } from '@faker-js/faker'
import { HttpStatus } from '@nestjs/common'
import { FamilyMember } from 'src/application/entities/family-member.entity'
import { Family } from 'src/application/entities/family.entity'
import { User } from 'src/application/entities/user'
import { FamilyMemberRepository } from 'src/application/repositories/family-member.repository'
import { FamilyRepository } from 'src/application/repositories/family.repository'
import { UserRepository } from 'src/application/repositories/user.repository'
import { FAMILY_MEMBER_REPOSITORY, FAMILY_REPOSITORY, USER_REPOSITORY } from 'src/shared/tokens'
import { CreateFamilyMemberUseCase } from './create'

jest.mock('@nestjs/common/services/logger.service')

describe('Create Family Member use case', () => {
	let useCase: CreateFamilyMemberUseCase
	let familyMemberRepository: jest.Mocked<FamilyMemberRepository>
	let familyRepository: jest.Mocked<FamilyRepository>
	let userRepository: jest.Mocked<UserRepository>

	beforeEach(() => {
		const { unit, unitRef } = TestBed.create(CreateFamilyMemberUseCase).compile()

		useCase = unit
		familyMemberRepository = unitRef.get<FamilyMemberRepository>(FAMILY_MEMBER_REPOSITORY)
		familyRepository = unitRef.get<FamilyRepository>(FAMILY_REPOSITORY)
		userRepository = unitRef.get<UserRepository>(USER_REPOSITORY)
	})

	it('should create family member', async () => {
		const family = Family.create({ id: faker.number.int(10), name: faker.string.sample() })
		const dto = {
			familyId: family.id,
			userId: faker.string.uuid(),
		}
		const familyMember = FamilyMember.create(dto)

		familyMemberRepository.save.mockResolvedValue(familyMember)
		familyRepository.findBySerial.mockResolvedValue(family)
		userRepository.findById.mockResolvedValue(
			User.create({
				id: faker.string.uuid(),
				email: faker.internet.email(),
				emailConfirmedAt: new Date(),
				isSuperAdmin: false,
			}),
		)

		const { data, statusCode, message } = await useCase.execute({
			familySerial: faker.string.ulid(),
			userId: faker.string.uuid(),
		})

		expect(data).toBeInstanceOf(FamilyMember)
		expect(statusCode).toBe(HttpStatus.CREATED)
		expect(message).toBe('Family Member created successfully!')
	})
})
