import { ApiProperty } from '@nestjs/swagger'
import { DateTime } from 'luxon'

export type CategoryProps = {
	id?: number
	name: string
	iconName: string
	userId?: string
	createdAt?: Date
	updatedAt?: Date
}

export class Category {
	@ApiProperty()
	id: number

	@ApiProperty()
	name: string

	@ApiProperty()
	iconName: string

	@ApiProperty()
	userId?: string

	@ApiProperty()
	createdAt: DateTime

	@ApiProperty()
	updatedAt: DateTime

	constructor(props: CategoryProps) {
		this.id = props.id
		this.name = props.name
		this.iconName = props.iconName
		this.userId = props.userId
		this.createdAt = props.createdAt ? DateTime.fromJSDate(props.createdAt) : DateTime.now()
		this.updatedAt = props.updatedAt ? DateTime.fromJSDate(props.updatedAt) : DateTime.now()
	}

	static create(props: CategoryProps): Category {
		return new Category(props)
	}
}
