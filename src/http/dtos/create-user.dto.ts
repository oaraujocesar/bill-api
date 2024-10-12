import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsString } from 'class-validator'

export class CreateUserDto {
	@IsString()
	@ApiProperty()
	name: string

	@IsString()
	@ApiProperty()
	surname: string

	@IsDate()
	@ApiProperty()
	birthDate: Date
}
