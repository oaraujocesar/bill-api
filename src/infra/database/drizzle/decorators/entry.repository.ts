import { Inject } from '@nestjs/common'
import { ENTRY_REPOSITORY } from 'src/shared/tokens'

export function EntryRepo() {
	return Inject(ENTRY_REPOSITORY)
}
