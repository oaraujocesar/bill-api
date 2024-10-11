import { Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { AuthUser } from '@supabase/supabase-js'
import { Request } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'

@Injectable()
export class SupabaseStrategy extends PassportStrategy(Strategy, 'supabase') {
	private readonly logger = new Logger(SupabaseStrategy.name)

	constructor(configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([(request) => this.extractTokenFromRequest(request)]),
			secretOrKey: configService.get('JWT_SECRET'),
		})
	}

	async validate(user: AuthUser) {
		this.logger.log('Validating user', user.email)

		return user
	}

	private extractTokenFromRequest(request: Request) {
		const tokenInCookie = request.cookies?.Authentication
		const tokenInBearer = request.headers?.authorization?.replace('Bearer ', '')

		if (!tokenInCookie && !tokenInBearer) {
			throw new UnauthorizedException()
		}

		return tokenInCookie || tokenInBearer
	}
}
