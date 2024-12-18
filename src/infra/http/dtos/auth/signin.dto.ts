import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator'

export class SigninDto {
	@IsEmail()
	@IsNotEmpty()
	@ApiProperty()
	email: string

	@IsNotEmpty()
	@ApiProperty()
	@IsStrongPassword()
	password: string
}
