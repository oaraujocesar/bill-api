import { Body, Controller, Delete, Get, Logger, Param, Post, Res } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { CreateFamilyMemberUseCase } from 'src/application/use-cases/family-member/create'
import { DeleteFamilyMemberUseCase } from 'src/application/use-cases/family-member/delete'
import { ListFamilyMembersUseCase } from 'src/application/use-cases/family-member/list'
import { ShowFamilyMemberUseCase } from 'src/application/use-cases/family-member/show'
import { ULID } from 'ulidx'
import { ShowFamilyDoc } from '../decorators/doc/family/show-family-headers.doc'
import { CreateFamilyMemberDto } from '../dtos/family-member/create-family.dto'

@ApiTags('FamilyMember')
@ApiBearerAuth()
@Controller('families/:familySerial')
export class FamilyMemberController {
	private readonly logger = new Logger(FamilyMemberController.name)

	constructor(
		private readonly createFamilyMemberUseCase: CreateFamilyMemberUseCase,
		private readonly deleteFamilyMemberUseCase: DeleteFamilyMemberUseCase,
		private readonly showFamilyMemberUseCase: ShowFamilyMemberUseCase,
		private readonly listFamilyMembersUseCase: ListFamilyMembersUseCase,
	) {}

	@Get('/members/:serial')
	@ShowFamilyDoc()
	async showFamilyMember(@Param('serial') serial: ULID, @Res() response: Response) {
		this.logger.debug('[Show Family Member]: called.')

		const { data, statusCode, message } = await this.showFamilyMemberUseCase.execute(serial)

		return response.status(statusCode).json({ data, message })
	}

	@Get('/members')
	@ApiOperation({ summary: 'List all family members' })
	async listFamilyMembers(@Param('familyId') familyId: number, @Res() response: Response) {
		this.logger.debug('[List Family Members]: called.')

		const { data, statusCode, message } = await this.listFamilyMembersUseCase.execute(familyId)

		return response.status(statusCode).json({ data, message })
	}

	@Post('/members')
	@ApiOperation({ summary: 'Creates a family member' })
	async createFamilyMember(@Body() body: CreateFamilyMemberDto, @Res() response: Response) {
		this.logger.debug(`[Create Family Member]: called with body ${JSON.stringify(body)}.`)

		const { data, statusCode, message } = await this.createFamilyMemberUseCase.execute(body)

		return response.status(statusCode).json({ data, message })
	}

	@Delete('/members/:serial')
	@ApiOperation({ summary: 'Deletes a family member' })
	async deleteFamilyMember(@Param('serial') serial: string, @Res() response: Response) {
		this.logger.debug(`[Delete Family Member]: called for serial: ${serial}.`)

		const { data, statusCode, message } = await this.deleteFamilyMemberUseCase.execute(serial)

		return response.status(statusCode).json({ data, message })
	}
}
