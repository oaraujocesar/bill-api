import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from './infra/database/database.module'
import { HttpModule } from './infra/http/http.module'
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
