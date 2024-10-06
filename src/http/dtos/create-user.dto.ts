import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsStrongPassword, IsEmail } from 'class-validator'

export class CreateUserDto {
	@IsString()
	@ApiProperty()
	name: string

	@IsString()
	@ApiProperty()
	surname: string

	@IsString()
	@IsEmail()
	@ApiProperty()
	email: string

	@IsStrongPassword({ minLength: 10 })
	@ApiProperty()
	password: string
}
