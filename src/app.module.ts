import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from './infra/database/database.module'
import { SupabaseGuard, SupabaseModule } from './infra/auth/supabase'
import { APP_GUARD } from '@nestjs/core'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		DatabaseModule,
		SupabaseModule,
	],
	controllers: [],
	providers: [
		{
			provide: APP_GUARD,
			useClass: SupabaseGuard,
		},
	],
})
export class AppModule {}
