import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common'
import { FamilyMember } from 'src/application/entities/family-member.entity'
import { Family } from 'src/application/entities/family.entity'
import { FamilyMemberRepository } from 'src/application/repositories/family-member.repository'
import { FamilyRepository } from 'src/application/repositories/family.repository'
import { FAMILY_REPOSITORY } from 'src/shared/tokens'
import { ResponseBody, buildResponse } from 'src/shared/utils/build-response'

type CreateFamilyRequest = {
	name: string
}

@Injectable()
export class CreateFamilyUseCase {
	private readonly logger = new Logger(CreateFamilyUseCase.name)

	constructor(
		@Inject(FAMILY_REPOSITORY) private readonly familyRepository: FamilyRepository,
		private readonly familyMemberRepository: FamilyMemberRepository,
	) {}

	async execute({ name }: CreateFamilyRequest, userId: string): Promise<ResponseBody<Family>> {
		this.logger.debug('execution started')

		let family = Family.create({ name, userId })

		family = await this.familyRepository.save(family)

		family.id = undefined

		this.logger.debug(`family created ${JSON.stringify(family)}.`)

		this.logger.debug('creating family member (owner)...')

		const familyMember = FamilyMember.create({ familyId: family.id, userId, isOwner: true })
		await this.familyMemberRepository.save(familyMember)

		this.logger.debug('family member (owner) created.')

		return buildResponse({
			data: family,
			statusCode: HttpStatus.CREATED,
			message: 'Family created successfully!',
		})
	}
}
