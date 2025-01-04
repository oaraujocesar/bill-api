import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { FamilyMember } from 'src/application/entities/family-member.entity'
import { FamilyMemberRepository } from 'src/application/repositories/family-member.repository'
import { FAMILY_MEMBER_REPOSITORY } from 'src/shared/tokens';
import { ResponseBody, buildResponse } from 'src/shared/utils/build-response'
import { ULID } from 'ulidx'

@Injectable()
export class ShowFamilyMemberUseCase {
	constructor(@Inject(FAMILY_MEMBER_REPOSITORY) private readonly familyMemberRepository: FamilyMemberRepository) {}

	async execute(serial: ULID): Promise<ResponseBody<FamilyMember>> {
		const familyMember = await this.familyMemberRepository.findBySerial(serial)

		if (!familyMember) {
			return buildResponse({
				statusCode: HttpStatus.NO_CONTENT,
				message: 'Family member not found.',
				errors: [{ code: 'BILL-204' }],
			})
		}

		return buildResponse({
			data: familyMember,
			statusCode: HttpStatus.OK,
			message: 'Family member found.',
		})
	}
}
