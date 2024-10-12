import { Module } from '@nestjs/common'
import { UserRepository } from 'src/application/repositories/user.repository'
import { DrizzleModule } from './drizzle/drizzle.module'
import { UserDrizzleRepository } from './drizzle/repositories/user.drizzle.repository'

@Module({
	imports: [DrizzleModule],
	providers: [
		{
			provide: UserRepository,
			useClass: UserDrizzleRepository,
		},
	],
	exports: [UserRepository],
})
export class DatabaseModule {}
