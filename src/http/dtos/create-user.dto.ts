import { ApiProperty } from '@nestjs/swagger'
import { IsDateString, IsString } from 'class-validator'

export class CreateUserDto {
	@IsString()
	@ApiProperty()
	name: string

	@IsString()
	@ApiProperty()
	surname: string

	@IsDateString()
	@ApiProperty()
	birthDate: string
}
