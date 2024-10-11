import { Injectable, Logger, Scope } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SupabaseClient, createClient } from '@supabase/supabase-js'

@Injectable({ scope: Scope.REQUEST })
export class SupabaseService {
	private clientInstance: SupabaseClient
	private readonly logger = new Logger(SupabaseService.name)

	constructor(private readonly configService: ConfigService) {}

	getClient() {
		this.logger.log('Getting supabase client')
		if (this.clientInstance) {
			return this.clientInstance
		}

		this.clientInstance = createClient(this.configService.get('SUPABASE_URL'), this.configService.get('SUPABASE_KEY'), {
			auth: {
				autoRefreshToken: true,
				detectSessionInUrl: false,
			},
		})

		return this.clientInstance.auth
	}
}
