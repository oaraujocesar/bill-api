import { TestBed } from '@automock/jest'
import { faker } from '@faker-js/faker'
import { HttpStatus } from '@nestjs/common'
import { FAMILY_MEMBER_REPOSITORY } from 'src/shared/tokens';
import { ShowFamilyMemberUseCase } from './show'
import { FamilyMemberRepository } from 'src/application/repositories/family-member.repository'
import { FamilyMember } from 'src/application/entities/family-member.entity'

jest.mock('@nestjs/common/services/logger.service')

describe('show non deleted family member use case', () => {
	let useCase: ShowFamilyMemberUseCase
	let familyMemberRepository: jest.Mocked<FamilyMemberRepository>

	beforeEach(() => {
		const { unit, unitRef } = TestBed.create(ShowFamilyMemberUseCase).compile()

		useCase = unit
		familyMemberRepository = unitRef.get<FamilyMemberRepository>(FAMILY_MEMBER_REPOSITORY)
	})

	it('should show family member', async () => {
		const familyMember: FamilyMember = FamilyMember.create({
			familyId: faker.number.int(),
			userId: faker.string.uuid(),
			serial: faker.string.ulid(),
		});


		familyMemberRepository.findBySerial.mockResolvedValue(familyMember)

		const { statusCode, message, data } = await useCase.execute(familyMember.serial)

		expect(statusCode).toBe(HttpStatus.OK)
		expect(message).toBe('Family member found.')
		expect(data).toEqual(familyMember)
		expect(familyMemberRepository.findBySerial).toHaveBeenCalledTimes(1)
		expect(familyMemberRepository.findBySerial).toHaveBeenCalledWith(familyMember.serial)
	})

	it('should return error if family member is not found', async () => {
		const familyMemberSerial = faker.string.ulid()

		familyMemberRepository.findBySerial.mockResolvedValue(null)

		const { statusCode, message, data } = await useCase.execute(familyMemberSerial)

		expect(statusCode).toBe(HttpStatus.NO_CONTENT)
		expect(message).toBe('Family member not found.')
		expect(data).toBeUndefined()
		expect(familyMemberRepository.findBySerial).toHaveBeenCalledTimes(1)
		expect(familyMemberRepository.findBySerial).toHaveBeenCalledWith(familyMemberSerial)
	})
})
