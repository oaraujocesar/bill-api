import { ApiProperty } from '@nestjs/swagger'

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
	createdAt: Date

	@ApiProperty()
	updatedAt: Date

	constructor(props: CategoryProps) {
		this.id = props.id
		this.name = props.name
		this.iconName = props.iconName
		this.userId = props.userId
		this.createdAt = props.createdAt ?? new Date()
		this.updatedAt = props.updatedAt ?? new Date()
	}

	static create(props: CategoryProps): Category {
		return new Category(props)
	}
}
