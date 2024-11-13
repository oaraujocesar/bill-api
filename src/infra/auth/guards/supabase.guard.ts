import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SupabaseClient, createClient } from '@supabase/supabase-js'
import { Request } from 'express'
import { RequestWithUser } from 'src/http/types/authenticated-request'
import { SupabaseToken } from '../types/supabase-token.type'

@Injectable()
export class SupabaseGuard implements CanActivate {
	private readonly logger = new Logger(SupabaseGuard.name)
	readonly supabase: SupabaseClient
	private readonly configService: ConfigService

	constructor(configService: ConfigService) {
		this.supabase = createClient(configService.get('SUPABASE_URL'), configService.get('SUPABASE_KEY'), {
			auth: {
				autoRefreshToken: true,
				detectSessionInUrl: false,
			},
		})

		this.configService = configService
	}

	async canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest<RequestWithUser>()

		if (this.configService.get<string>('NODE_ENV') === 'development') {
			let user = this.configService.get('LOCAL_USER')

			try {
				user = JSON.parse(user)
			} catch (error) {
				this.logger.error(error)
				throw new UnauthorizedException('Local user not found')
			}

			request.user = {
				id: user.id,
				email: user.email,
			}

			return true
		}

		const token = this.extractTokenFromRequest(request)

		const {
			data: { user },
			error,
		} = await this.supabase.auth.getUser(token.access_token)
		if (error) {
			this.logger.error('Supabase error', error)
			throw new UnauthorizedException(error)
		}
		request.user = {
			id: user.id,
			email: user.email,
		}

		this.logger.debug(`Supabase user: ${user.email}`)

		return true
	}

	private extractTokenFromRequest(request: Request): SupabaseToken {
		const tokenInCookie = request.cookies['sb-xzsemyschgzwsaixcblq-auth-token']
		const tokenInBearer = request.headers?.authorization?.replace('Bearer ', '')

		if (!tokenInCookie && !tokenInBearer) {
			throw new UnauthorizedException()
		}

		const token = tokenInCookie || tokenInBearer

		return JSON.parse(Buffer.from(token.replace('base64-', ''), 'base64').toString())
	}
}
