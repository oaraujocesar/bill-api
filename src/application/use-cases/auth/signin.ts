import { HttpStatus, Injectable, Logger } from '@nestjs/common'
import { Session } from '@supabase/supabase-js'
import { Exception } from 'src/shared/exceptions/custom.exception'
import { SupabaseService } from 'src/shared/services/supabase.service'
import { ResponseBody, buildResponse } from 'src/shared/utils/build-response'

export type SigninRequest = {
	email: string
	password: string
}

@Injectable()
export class SigninUseCase {
	private readonly logger = new Logger(SigninUseCase.name)

	constructor(private readonly supabase: SupabaseService) {}

	async execute({ email, password }: SigninRequest): Promise<ResponseBody<Omit<Session, 'user'>>> {
		this.logger.debug('execution started')

		const { data, error } = await this.supabase.auth.signInWithPassword({
			email,
			password,
		})
		if (error) {
			throw new Exception({
				error,
				message: error.message,
				statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
				errors: [{ code: error.code }],
			})
		}

		const { user, ...session } = data.session

		return buildResponse({
			message: 'User signed in successfully!',
			data: session,
			statusCode: HttpStatus.OK,
		})
	}
}
