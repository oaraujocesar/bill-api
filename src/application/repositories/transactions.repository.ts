import { Account } from '../entities/account.entity'
import { Entry } from '../entities/entry.entity'

export type CreateEntryRepositoryInput = {
	entry: Entry
	account?: Account
}

export interface TransactionRepository {
	createEntry(input: CreateEntryRepositoryInput): Promise<Entry>
}
