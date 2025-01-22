import { TestBed } from '@automock/jest'
import { faker } from '@faker-js/faker'
import { HttpStatus } from '@nestjs/common'
import { FamilyMember } from 'src/application/entities/family-member.entity'
import { FamilyMemberRepository } from 'src/application/repositories/family-member.repository'
import { FAMILY_MEMBER_REPOSITORY } from 'src/shared/tokens'
import { ListFamilyMembersUseCase } from './list'

jest.mock('@nestjs/common/services/logger.service')

describe('List all non deleted accounts use case', () => {
	let useCase: ListFamilyMembersUseCase
	let familyMemberRepository: jest.Mocked<FamilyMemberRepository>

	beforeEach(() => {
		const { unit, unitRef } = TestBed.create(ListFamilyMembersUseCase).compile()

		useCase = unit
		familyMemberRepository = unitRef.get<FamilyMemberRepository>(FAMILY_MEMBER_REPOSITORY)
	})

	it('should list all family members', async () => {
		const familyId = faker.number.int()
		const familySerial = faker.string.ulid()
		const familyMembers: FamilyMember[] = [
			FamilyMember.create({
				familyId,
				userId: faker.string.uuid(),
			}),
			FamilyMember.create({
				familyId,
				userId: faker.string.uuid(),
			}),
		]

		familyMemberRepository.listByFamilySerial.mockResolvedValue(familyMembers)

		const { statusCode, message, data } = await useCase.execute(familySerial)

		expect(statusCode).toBe(HttpStatus.OK)
		expect(message).toBe('Family Members found.')
		expect(data).toEqual(familyMembers)
		expect(familyMemberRepository.listByFamilySerial).toHaveBeenCalledTimes(1)
		expect(familyMemberRepository.listByFamilySerial).toHaveBeenCalledWith(familySerial)
	})

	it('should show an empty array', async () => {
		const familyId = faker.string.ulid()

		familyMemberRepository.listByFamilySerial.mockResolvedValue([])

		const { statusCode, message, data } = await useCase.execute(familyId)

		expect(statusCode).toBe(HttpStatus.NO_CONTENT)
		expect(message).toBe('No Family Members found.')
		expect(data).toBeUndefined()
		expect(familyMemberRepository.listByFamilySerial).toHaveBeenCalledTimes(1)
		expect(familyMemberRepository.listByFamilySerial).toHaveBeenCalledWith(familyId)
	})
})
