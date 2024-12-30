import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

export const DRIZZLE = Symbol('drizzle')

@Module({
	providers: [
		{
			provide: DRIZZLE,
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => {
				const databaseURL = configService.getOrThrow<string>('DATABASE_URL')
				const pool = new Pool({ connectionString: databaseURL })

				return drizzle(pool, { schema, casing: 'snake_case' }) as NodePgDatabase<typeof schema>
			},
		},
	],
	exports: [DRIZZLE],
})
export class DrizzleModule {}
