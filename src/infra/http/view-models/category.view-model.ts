import { ApiProperty } from '@nestjs/swagger'
import { Category } from 'src/application/entities/category.entity'

export class CategoryViewModel {
	@ApiProperty()
	id: number

	@ApiProperty()
	name: string

	@ApiProperty()
	icon_name: string

	static toHTTP(category: Category) {
		return {
			id: category.id,
			name: category.name,
			icon_name: category.iconName,
		}
	}
}
