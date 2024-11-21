import { HttpStatus, Injectable, Logger } from '@nestjs/common'
import { Session } from '@supabase/supabase-js'
import { SupabaseErrors } from 'src/shared/enums/supabase-errors.enum'
import { SupabaseService } from 'src/shared/services/supabase.service'
import { UseCaseResponse, buildResponse } from 'src/shared/utils/build-response'

export type SigninRequest = {
	email: string
	password: string
}

@Injectable()
export class SigninUseCase {
	private readonly logger = new Logger(SigninUseCase.name)

	constructor(private readonly supabase: SupabaseService) {}

	async execute({ email, password }: SigninRequest): Promise<UseCaseResponse<Omit<Session, 'user'>>> {
		this.logger.debug('execution started')

		const { data, error } = await this.supabase.auth.signInWithPassword({
			email,
			password,
		})

		if (error) {
			this.logger.debug(`Supabase error: ${error.message}`)

			if (error.code === SupabaseErrors.INVALID_CREDENTIALS) {
				return buildResponse({
					isError: true,
					message: 'Invalid credentials',
					data: null,
					status: HttpStatus.BAD_REQUEST,
				})
			}

			this.logger.error(error)

			return buildResponse({
				isError: true,
				details: {
					code: 'BILL-203',
				},
				message: 'It was not possible to sign in',
				data: null,
				status: HttpStatus.BAD_REQUEST,
			})
		}

		const { user, ...session } = data.session

		return buildResponse({
			isError: false,
			message: 'User signed in successfully',
			data: session,
			status: HttpStatus.OK,
		})
	}
}
