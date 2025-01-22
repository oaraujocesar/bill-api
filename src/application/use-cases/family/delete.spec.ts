import { TestBed } from '@automock/jest'
import { faker } from '@faker-js/faker'
import { HttpStatus } from '@nestjs/common'
import { Family } from 'src/application/entities/family.entity'
import { FamilyRepository } from 'src/application/repositories/family.repository'
import { CreateFamilyDto } from 'src/infra/http/dtos/family/create-family.dto'
import { Exception } from 'src/shared/exceptions/custom.exception'
import { FAMILY_REPOSITORY } from 'src/shared/tokens'
import { DeleteFamilyUseCase } from './delete'

jest.mock('@nestjs/common/services/logger.service')

describe('Soft delete Family use case', () => {
	let useCase: DeleteFamilyUseCase
	let familyRepository: jest.Mocked<FamilyRepository>

	beforeEach(() => {
		const { unit, unitRef } = TestBed.create(DeleteFamilyUseCase).compile()

		useCase = unit
		familyRepository = unitRef.get<FamilyRepository>(FAMILY_REPOSITORY)
	})

	it('should delete family', async () => {
		const dto: CreateFamilyDto = {
			name: faker.company.name(),
		}
		const serial = faker.string.ulid()

		familyRepository.save.mockResolvedValue(
			Family.create({
				name: dto.name,
				serial,
			}),
		)

		familyRepository.findBySerial.mockResolvedValue(
			Family.create({
				name: dto.name,
				serial,
			}),
		)

		const { statusCode, message } = await useCase.execute(serial)

		expect(statusCode).toBe(HttpStatus.NO_CONTENT)
		expect(message).toBe('Family deleted successfully!')
	})

	it('should throw an error if family is not found when deleting', async () => {
		const serial = faker.string.ulid()

		await expect(useCase.execute(serial)).rejects.toThrow(
			new Exception({
				statusCode: HttpStatus.NOT_FOUND,
				message: 'Family not found!',
			}),
		)
	})
})
