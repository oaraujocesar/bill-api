import { Body, Controller, Delete, Get, Logger, Param, Post, Res } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { CreateFamilyMemberUseCase } from 'src/application/use-cases/family-member/create'
import { DeleteFamilyMemberUseCase } from 'src/application/use-cases/family-member/delete'
import { ListFamilyMembersUseCase } from 'src/application/use-cases/family-member/list'
import { CreateFamilyMemberDoc } from '../decorators/doc/family-member/create-family-member-headers.doc'
import { DeleteFamilyMemberDoc } from '../decorators/doc/family-member/delete-family-member-headers.doc'
import { ListFamilyMembersDoc } from '../decorators/doc/family-member/list-family-members-headers.doc'
import { CreateFamilyMemberDto } from '../dtos/family-member/create-family.dto'
import { FamilyMemberViewModel } from '../view-models/family-member.view-model'

@ApiTags('FamilyMember')
@ApiBearerAuth()
@Controller('families/:familySerial')
export class FamilyMemberController {
	private readonly logger = new Logger(FamilyMemberController.name)

	constructor(
		private readonly createFamilyMemberUseCase: CreateFamilyMemberUseCase,
		private readonly deleteFamilyMemberUseCase: DeleteFamilyMemberUseCase,
		private readonly listFamilyMembersUseCase: ListFamilyMembersUseCase,
	) {}

	@Get('/members')
	@ListFamilyMembersDoc()
	@ApiOperation({ summary: 'List all family members' })
	async listFamilyMembers(@Param('familySerial') familySerial: string, @Res() response: Response) {
		this.logger.debug('[listFamilyMembers]: called.')

		const { data, statusCode, message } = await this.listFamilyMembersUseCase.execute(familySerial)

		return response.status(statusCode).json({ data: data.map(FamilyMemberViewModel.toHTTP), message })
	}

	@Post('/members')
	@CreateFamilyMemberDoc()
	@ApiOperation({ summary: 'Creates a family member' })
	async createFamilyMember(
		@Res() response: Response,
		@Body() body: CreateFamilyMemberDto,
		@Param('familySerial') familySerial: string,
	) {
		this.logger.debug(`[createFamilyMember]: called with body ${JSON.stringify(body)}.`)

		const { data, statusCode, message } = await this.createFamilyMemberUseCase.execute({ ...body, familySerial })

		return response.status(statusCode).json({ data, message })
	}

	@Delete('/members/:serial')
	@DeleteFamilyMemberDoc()
	@ApiOperation({ summary: 'Deletes a family member' })
	async deleteFamilyMember(@Param('serial') serial: string, @Res() response: Response) {
		this.logger.debug(`[deleteFamilyMember]: called for serial: ${serial}.`)

		const { data, statusCode, message } = await this.deleteFamilyMemberUseCase.execute(serial)

		return response.status(statusCode).json({ data, message })
	}
}
