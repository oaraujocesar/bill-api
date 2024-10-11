import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { HttpModule } from './http/http.module'
import { AuthModule } from './infra/auth/auth.module'
import { SupabaseGuard } from './infra/auth/guards/supabase.guard'
import { DatabaseModule } from './infra/database/database.module'

@Module({
	imports: [
		HttpModule,
		AuthModule,
		DatabaseModule,
		ConfigModule.forRoot({
			isGlobal: true,
		}),
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: SupabaseGuard,
		},
	],
})
export class AppModule {}
