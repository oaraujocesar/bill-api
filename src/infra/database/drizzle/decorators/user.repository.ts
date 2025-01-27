import { Inject } from '@nestjs/common'
import { USER_REPOSITORY } from 'src/shared/tokens'

export function UserRepository() {
	return Inject(USER_REPOSITORY)
}
