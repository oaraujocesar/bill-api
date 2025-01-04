import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CreateFamilyDto {
	@IsString()
	@ApiProperty()
	name: string
}
