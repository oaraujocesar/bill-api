import { ApiProperty } from '@nestjs/swagger'
import { BaseEntity } from './helpers/base.entity'

export type CategoryProps = {
	id?: number
	name: string
	iconName: string
	userId: string
	createdAt?: Date
	updatedAt?: Date
	deletedAt?: Date
}

export class Category extends BaseEntity {
	@ApiProperty()
	id: number

	@ApiProperty()
	name: string

	@ApiProperty()
	iconName: string

	@ApiProperty()
	userId: string

	constructor(props: CategoryProps) {
		super({ createdAt: props.createdAt, updatedAt: props.updatedAt, deletedAt: props.deletedAt })
		this.id = props.id
		this.name = props.name
		this.iconName = props.iconName
		this.userId = props.userId
	}

	static create(props: CategoryProps): Category {
		return new Category(props)
	}
}
