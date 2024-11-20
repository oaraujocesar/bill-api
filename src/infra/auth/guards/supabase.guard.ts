import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { RequestWithUser } from 'src/http/types/authenticated-request'
import { SupabaseService } from 'src/shared/services/supabase.service'
import { SupabaseToken } from '../types/supabase-token.type'

@Injectable()
export class SupabaseGuard implements CanActivate {
	private readonly logger = new Logger(SupabaseGuard.name)

	constructor(
		private readonly reflector: Reflector,
		private readonly supabase: SupabaseService,
	) {}

	async canActivate(context: ExecutionContext) {
		const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler())
		if (isPublic) {
			return true
		}

		const request = context.switchToHttp().getRequest<RequestWithUser>()

		const token = this.extractTokenFromRequest(request)

		const {
			data: { user },
			error,
		} = await this.supabase.client.auth.getUser(token.access_token)
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
