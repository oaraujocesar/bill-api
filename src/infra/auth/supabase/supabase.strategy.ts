import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt } from 'passport-jwt'
import { SupabaseAuthStrategy } from 'nestjs-supabase-auth'

@Injectable()
export class SupabaseStrategy extends PassportStrategy(SupabaseAuthStrategy, 'supabase') {
	public constructor() {
		super({
			supabaseUrl: process.env.SUPABASE_URL,
			supabaseKey: process.env.SUPABASE_KEY,
			supabaseOptions: {},
			supabaseJwtSecret: process.env.SUPABASE_JWT_SECRET,
			extractor: ExtractJwt.fromAuthHeaderAsBearerToken(),
		})
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	async validate(payload: any): Promise<any> {
		super.validate(payload)
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	authenticate(req: any) {
		super.authenticate(req)
	}
}
