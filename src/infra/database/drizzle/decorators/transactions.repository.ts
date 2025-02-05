import { Inject } from '@nestjs/common'
import { TRANSACTIONS_REPOSITORY } from 'src/shared/tokens'

export function Transactions() {
	return Inject(TRANSACTIONS_REPOSITORY)
}
