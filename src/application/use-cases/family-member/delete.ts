import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common'
import { BaseUseCase } from 'src/application/interfaces/use-case.interface'
import { FamilyMemberRepository } from 'src/application/repositories/family-member.repository'
import { UserAuthenticated } from 'src/infra/http/types/authenticated-request'
import { Exception } from 'src/shared/exceptions/custom.exception'
import { FAMILY_MEMBER_REPOSITORY } from 'src/shared/tokens'
import { ResponseBody, buildResponse } from 'src/shared/utils/build-response'

@Injectable()
export class DeleteFamilyMemberUseCase implements BaseUseCase {
	constructor(@Inject(FAMILY_MEMBER_REPOSITORY) private readonly familyMemberRepository: FamilyMemberRepository) {}

	private readonly logger = new Logger(DeleteFamilyMemberUseCase.name)

	async execute({ user, userId }: { userId: string; user: UserAuthenticated }): Promise<ResponseBody<void>> {
		this.logger.debug('[deleteFamilyMember]: execution started.')
		const familyMember = await this.familyMemberRepository.findByUserId(userId)
		const familyOwner = await this.familyMemberRepository.findByUserId(user.id)

		if (!familyMember || !familyOwner) {
			this.logger.debug(`family member with id ${userId} not found`)

			throw new Exception({ message: 'Family member not found!', statusCode: HttpStatus.NOT_FOUND })
		}

		if (!familyOwner.isOwner) {
			this.logger.debug('family member is not the owner')

			throw new Exception({ message: 'You are not the owner of the family!', statusCode: HttpStatus.FORBIDDEN })
		}

		if (familyMember.userId === userId) {
			this.logger.debug(`family member with serial ${userId} is trying to delete himself`)

			throw new Exception({ message: 'You cannot delete yourself!', statusCode: HttpStatus.UNPROCESSABLE_ENTITY })
		}

		await this.familyMemberRepository.delete(familyMember)
		this.logger.debug('family member deleted successfully')

		return buildResponse({
			statusCode: HttpStatus.NO_CONTENT,
			message: 'Family member deleted successfully!',
		})
	}
}
