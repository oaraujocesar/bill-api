import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SupabaseClient, createClient } from '@supabase/supabase-js'

@Injectable()
export class SupabaseService {
	readonly client: SupabaseClient

	constructor(configService: ConfigService) {
		this.client = createClient(configService.get('SUPABASE_URL'), configService.get('SUPABASE_KEY'), {
			auth: {
				autoRefreshToken: true,
				detectSessionInUrl: false,
			},
		})
	}
}
