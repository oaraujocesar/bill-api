import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { SupabaseGuard } from './guards/supabase.guard'
import { SupabaseStrategy } from './strategies/supabase.strategy'
import { SupabaseService } from './supabase.service'

@Module({
	imports: [
		JwtModule.registerAsync({
			inject: [ConfigService],
			useFactory(configService: ConfigService) {
				return {
					global: true,
					secret: configService.getOrThrow<string>('JWT_SECRET'),
					signOptions: { expiresIn: '1d' },
				}
			},
		}),
	],
	providers: [SupabaseService, SupabaseGuard, SupabaseStrategy],
	exports: [SupabaseService, SupabaseGuard, SupabaseStrategy],
})
export class AuthModule {}
