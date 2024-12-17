import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { HttpModule } from './http/http.module'
import { DatabaseModule } from './infra/database/database.module'
import { SupabaseService } from './shared/services/supabase.service'

@Module({
	imports: [
		HttpModule,
		DatabaseModule,
		ConfigModule.forRoot({
			isGlobal: true,
		}),
	],
	providers: [SupabaseService],
})
export class AppModule {}
