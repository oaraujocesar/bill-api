import { HttpStatus, Injectable, Logger } from '@nestjs/common'
import { BaseUseCase } from 'src/application/interfaces/use-case.interface'
import { SupabaseService } from 'src/shared/services/supabase.service'
import { buildResponse } from 'src/shared/utils/build-response'

export type RefreshTokenUseCaseInput = {
	refreshToken: string
}

@Injectable()
export class RefreshTokenUseCase implements BaseUseCase {
	constructor(private readonly supabase: SupabaseService) {}

	private readonly logger = new Logger(RefreshTokenUseCase.name)

	async execute({ refreshToken }: RefreshTokenUseCaseInput) {
		const {
			data: { session },
			error,
		} = await this.supabase.auth.refreshSession({ refresh_token: refreshToken })
		if (error) {
			this.logger.error(error.stack)

			return buildResponse({
				statusCode: HttpStatus.UNAUTHORIZED,
				message: 'It was not possible to refresh token.',
			})
		}
		this.logger.debug(`Token refreshed for token ${refreshToken}`)

		const { user, ...filteredSession } = session

		return buildResponse({
			message: 'Token refreshed!',
			statusCode: HttpStatus.CREATED,
			data: filteredSession,
		})
	}
}