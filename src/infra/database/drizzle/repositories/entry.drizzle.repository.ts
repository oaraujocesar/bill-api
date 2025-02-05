import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Entry } from 'src/application/entities/entry.entity'
import { EntryRepository } from 'src/application/repositories/entry.repository'
import { DRIZZLE } from '../drizzle.module'
import { EntryMapper } from '../mapper/entry-mapper'
import * as schema from '../schema'

@Injectable()
export class EntryDrizzleRepository implements EntryRepository {
	constructor(@Inject(DRIZZLE) private readonly database: NodePgDatabase<typeof schema>) {}

	private readonly logger = new Logger(EntryDrizzleRepository.name)

	async upsert(entry: Entry): Promise<Entry> {
		const drizzleEntry = EntryMapper.toDrizzle(entry)
		try {
			switch (!!drizzleEntry.id) {
				case true: {
					const [savedEntry] = await this.database
						.update(schema.entries)
						.set(drizzleEntry)
						.where(eq(schema.entries.id, drizzleEntry.id))
						.returning()
						.execute()

					return EntryMapper.toDomain({ drizzleEntry: savedEntry })
				}
				case false: {
					const [savedEntry] = await this.database.insert(schema.entries).values(drizzleEntry).returning().execute()

					return EntryMapper.toDomain({ drizzleEntry: savedEntry })
				}
			}
		} catch (error) {
			this.logger.error(error.stack)
			throw new InternalServerErrorException()
		}
	}
}
