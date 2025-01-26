import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class CreateFamilyMemberDto {
	@IsUUID()
	@ApiProperty()
	user_id: string
}
