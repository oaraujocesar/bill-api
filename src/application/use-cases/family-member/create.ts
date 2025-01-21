import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common'
import { FamilyMember } from 'src/application/entities/family-member.entity'
import { FamilyMemberRepository } from 'src/application/repositories/family-member.repository'
import { FamilyRepository } from 'src/application/repositories/family.repository'
import { UserRepository } from 'src/application/repositories/user.repository'
import { Exception } from 'src/shared/exceptions/custom.exception'
import { FAMILY_MEMBER_REPOSITORY, FAMILY_REPOSITORY, USER_REPOSITORY } from 'src/shared/tokens'
import { ResponseBody, buildResponse } from 'src/shared/utils/build-response'

type CreateFamilyMemberRequest = {
	userId: string
	familySerial: string
}

@Injectable()
export class CreateFamilyMemberUseCase {
	private readonly logger = new Logger(CreateFamilyMemberUseCase.name)

	constructor(
		@Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
		@Inject(FAMILY_REPOSITORY) private readonly familyRepository: FamilyRepository,
		@Inject(FAMILY_MEMBER_REPOSITORY) private readonly familyMemberRepository: FamilyMemberRepository,
	) {}

	async execute({ userId, familySerial }: CreateFamilyMemberRequest): Promise<ResponseBody<FamilyMember>> {
		this.logger.debug('execution started')

		const family = await this.familyRepository.findBySerial(familySerial)
		if (!family) {
			throw new Exception({ message: 'Family not found!', statusCode: HttpStatus.NOT_FOUND })
		}

		const user = await this.userRepository.findById(userId)
		if (!user) {
			throw new Exception({ message: 'User not found!', statusCode: HttpStatus.NOT_FOUND })
		}

		const familyMemberExists = await this.familyMemberRepository.findByUserAndFamilyId(userId, family.id)
		if (familyMemberExists) {
			throw new Exception({ message: 'User is already a member of this family!', statusCode: HttpStatus.CONFLICT })
		}

		const familyMember = await this.familyMemberRepository.save(FamilyMember.create({ userId, familyId: family.id }))

		this.logger.debug(`family member created ${JSON.stringify(familyMember)}`)

		return buildResponse({
			data: familyMember,
			statusCode: HttpStatus.CREATED,
			message: 'Family Member created successfully!',
		})
	}
}
