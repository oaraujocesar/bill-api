import { Inject } from '@nestjs/common'
import { FAMILY_REPOSITORY } from 'src/shared/tokens'

export function FamilyRepo() {
	return Inject(FAMILY_REPOSITORY)
}
