import { ApiProperty } from '@nestjs/swagger'
import { IsDateString, IsEmail, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator'

export class SignupDto {
	@IsEmail()
	@IsNotEmpty()
	@ApiProperty()
	email: string

	@IsNotEmpty()
	@ApiProperty()
	@IsStrongPassword()
	password: string

	@IsNotEmpty()
	@ApiProperty()
	@IsString()
	name: string

	@IsNotEmpty()
	@ApiProperty()
	@IsString()
	surname: string

	@IsDateString()
	@ApiProperty()
	birth_date: string
}
