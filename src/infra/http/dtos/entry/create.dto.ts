import { ApiProperty } from '@nestjs/swagger'
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'
import { EntryType } from 'src/application/entities/entry.entity'

export class CreateEntryDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	title: string

	@IsString()
	@IsOptional()
	@ApiProperty()
	description?: string

	@IsNumber({ maxDecimalPlaces: 2 })
	@IsNotEmpty()
	@ApiProperty()
	amount: number

	@IsString()
	@IsOptional()
	@ApiProperty()
	account_serial?: string

	@IsNumber()
	@IsOptional()
	@ApiProperty()
	installments?: number

	@IsEnum(EntryType)
	@IsNotEmpty()
	@ApiProperty({ enum: EntryType })
	entry_type: EntryType

	@IsNumber()
	@IsNotEmpty()
	@ApiProperty()
	category_id: number

	@IsOptional()
	@IsDateString()
	@ApiProperty({ example: new Date() })
	payday?: string
}
