import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SupabaseClient, createClient } from '@supabase/supabase-js'
import { SupabaseAuthClient } from '@supabase/supabase-js/dist/module/lib/SupabaseAuthClient'

@Injectable()
export class SupabaseService {
	private readonly client: SupabaseClient
	public auth: SupabaseAuthClient

	constructor(configService: ConfigService) {
		this.client = createClient(configService.get('SUPABASE_URL'), configService.get('SUPABASE_KEY'), {
			auth: {
				autoRefreshToken: true,
				detectSessionInUrl: false,
			},
		})

		this.auth = this.client.auth
	}
}
