import { TestBed } from '@automock/jest'
import { faker } from '@faker-js/faker'
import { HttpStatus } from '@nestjs/common'
import { FamilyMember } from 'src/application/entities/family-member.entity'
import { FamilyMemberRepository } from 'src/application/repositories/family-member.repository'
import { UserAuthenticated } from 'src/infra/http/types/authenticated-request'
import { Exception } from 'src/shared/exceptions/custom.exception'
import { FAMILY_MEMBER_REPOSITORY } from 'src/shared/tokens'
import { DeleteFamilyMemberUseCase } from './delete'

jest.mock('@nestjs/common/services/logger.service')

describe('Soft delete Family Member use case', () => {
	let useCase: DeleteFamilyMemberUseCase
	let familyMemberRepository: jest.Mocked<FamilyMemberRepository>

	beforeEach(() => {
		const { unit, unitRef } = TestBed.create(DeleteFamilyMemberUseCase).compile()

		useCase = unit
		familyMemberRepository = unitRef.get<FamilyMemberRepository>(FAMILY_MEMBER_REPOSITORY)
	})

	it('should delete family member', async () => {
		const familyMember = FamilyMember.create({
			userId: faker.string.uuid(),
			familyId: faker.number.int(10),
			isOwner: true,
		})

		const authenticatedUser: UserAuthenticated = {
			id: faker.string.uuid(),
			email: faker.internet.email(),
		}

		familyMemberRepository.findByUserId.mockResolvedValue(familyMember)
		familyMemberRepository.delete.mockResolvedValue()

		const userId = faker.string.uuid()
		const { statusCode, message } = await useCase.execute({ userId, user: authenticatedUser })

		expect(statusCode).toBe(HttpStatus.NO_CONTENT)
		expect(message).toBe('Family member deleted successfully!')
		expect(familyMemberRepository.delete).toHaveBeenCalledWith(familyMember)
		expect(familyMemberRepository.findByUserId).toHaveBeenCalledWith(userId)
		expect(familyMemberRepository.delete).toHaveBeenCalledTimes(1)
		expect(familyMemberRepository.findByUserId).toHaveBeenCalledTimes(2)
	})

	it('should throw an error if family member is not found when deleting', async () => {
		const userId = faker.string.uuid()

		const authenticatedUser: UserAuthenticated = {
			id: faker.string.uuid(),
			email: faker.internet.email(),
		}

		await expect(useCase.execute({ userId, user: authenticatedUser })).rejects.toThrow(
			new Exception({ message: 'Family member not found!', statusCode: HttpStatus.NOT_FOUND }),
		)
		expect(familyMemberRepository.findByUserId).toHaveBeenCalledWith(userId)
		expect(familyMemberRepository.findByUserId).toHaveBeenCalledWith(authenticatedUser.id)
		expect(familyMemberRepository.findByUserId).toHaveBeenCalledTimes(2)
	})

	it('should throw an error if user authenticated is not the owner', async () => {
		const familyMember = FamilyMember.create({
			userId: faker.string.uuid(),
			familyId: faker.number.int(10),
			isOwner: true,
		})

		const authenticatedUser: UserAuthenticated = {
			id: faker.string.uuid(),
			email: faker.internet.email(),
		}

		familyMemberRepository.findByUserId.mockResolvedValueOnce(familyMember)
		familyMemberRepository.findByUserId.mockResolvedValueOnce(
			FamilyMember.create({ isOwner: false, userId: authenticatedUser.id, familyId: familyMember.familyId }),
		)

		await expect(useCase.execute({ userId: familyMember.userId, user: authenticatedUser })).rejects.toThrow(
			new Exception({
				message: 'You are not the owner of the family!',
				statusCode: HttpStatus.FORBIDDEN,
			}),
		)
	})

	it('should throw an error if family member is trying to delete himself', async () => {
		const familyMember = FamilyMember.create({
			userId: faker.string.uuid(),
			familyId: faker.number.int(10),
			isOwner: true,
		})

		const authenticatedUser: UserAuthenticated = {
			id: familyMember.userId,
			email: faker.internet.email(),
		}

		familyMemberRepository.findByUserId.mockResolvedValueOnce(familyMember)
		familyMemberRepository.findByUserId.mockResolvedValueOnce(familyMember)

		await expect(useCase.execute({ userId: familyMember.userId, user: authenticatedUser })).rejects.toThrow(
			new Exception({
				message: 'You cannot delete yourself!',
				statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
			}),
		)
	})
})
