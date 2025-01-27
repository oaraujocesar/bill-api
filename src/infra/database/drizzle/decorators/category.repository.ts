import { Inject } from '@nestjs/common'
import { CATEGORY_REPOSITORY } from 'src/shared/tokens'

export function CategoryRepo() {
	return Inject(CATEGORY_REPOSITORY)
}
