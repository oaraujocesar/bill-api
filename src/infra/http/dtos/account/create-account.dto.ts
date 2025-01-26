import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateAccountDto {
	@IsString()
	@ApiProperty()
	@IsNotEmpty()
	name: string

	@IsNumber({ maxDecimalPlaces: 2 })
	@IsNotEmpty()
	@ApiProperty()
	initial_balance: number
}
