import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SupabaseClient } from '@supabase/supabase-js'

@Injectable()
export class SupabaseService extends SupabaseClient {
	constructor(configService: ConfigService) {
		super(configService.getOrThrow<string>('SUPABASE_URL'), configService.getOrThrow<string>('SUPABASE_KEY'), {
			auth: { autoRefreshToken: true },
		})
	}
}
