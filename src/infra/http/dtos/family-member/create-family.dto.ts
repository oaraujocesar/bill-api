import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class CreateFamilyMemberDto {
	@IsUUID()
	@ApiProperty()
	userId: string
}
