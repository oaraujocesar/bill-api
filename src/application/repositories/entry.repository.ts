import { Entry } from '../entities/entry.entity'

export interface EntryRepository {
	upsert(entry: Entry): Promise<Entry>
}
