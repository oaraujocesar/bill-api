import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
	Logger,
	UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { RequestWithUser } from 'src/infra/http/types/authenticated-request'
import { SupabaseService } from 'src/shared/services/supabase.service'

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
		} = await this.supabase.auth.getUser(token)
		if (error) {
			this.logger.error('Supabase error', error)
			throw new ForbiddenException()
		}
		request.user = {
			id: user.id,
			email: user.email,
		}

		return true
	}

	private extractTokenFromRequest(request: Request): string {
		const tokenInCookie = request.cookies['bill-auth-token']
		const tokenInBearer = request.headers?.authorization?.replace('Bearer ', '')

		if (!tokenInCookie && !tokenInBearer) {
			throw new UnauthorizedException()
		}

		return tokenInCookie || tokenInBearer
	}
}
