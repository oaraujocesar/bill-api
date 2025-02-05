import { Inject } from '@nestjs/common'
import { ACCOUNT_REPOSITORY } from 'src/shared/tokens'

export function AccountRepo() {
	return Inject(ACCOUNT_REPOSITORY)
}
