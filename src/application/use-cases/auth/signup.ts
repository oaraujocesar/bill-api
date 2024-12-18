import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common'
import { User } from 'src/application/entities/user'
import { UserProfile } from 'src/application/entities/user-profile'
import { UserRepository } from 'src/application/repositories/user.repository'
import { SupabaseService } from 'src/shared/services/supabase.service'
import { USER_REPOSITORY } from 'src/shared/tokens'
import { ResponseBody, buildResponse } from 'src/shared/utils/build-response'

export type SignupRequest = {
	email: string
	password: string
	name: string
	surname: string
	birthDate: string
}

@Injectable()
export class SignupUseCase {
	private readonly logger = new Logger(SignupUseCase.name)

	constructor(
		private readonly supabase: SupabaseService,
		@Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
	) {}

	async execute({ email, password, name, surname, birthDate }: SignupRequest): Promise<ResponseBody<undefined>> {
		this.logger.debug('execution started')

		let user = await this.userRepository.findByEmail(email)

		let userProfile: UserProfile

		if (user) {
			this.logger.debug(`user ${email} already exists, verifying if exists profile`)

			userProfile = await this.userRepository.findProfileByUserId(user.id)

			if (userProfile) {
				this.logger.debug(`user ${email} already exists and has a profile`)

				return buildResponse({
					errors: [{ code: 'BILL-201' }],
					statusCode: HttpStatus.BAD_REQUEST,
					message: 'It was not possible to create the user!',
				})
			}

			userProfile = UserProfile.create({
				name,
				surname,
				userId: user.id,
				birthDate: new Date(birthDate),
			})

			const savedUserProfile = await this.userRepository.saveProfile(userProfile)
			user.profile = savedUserProfile

			return buildResponse({
				statusCode: HttpStatus.CREATED,
				message: 'User created successfully!',
			})
		}

		const { data, error } = await this.supabase.auth.signUp({
			email,
			password,
		})
		if (error) {
			this.logger.error(error)
			return buildResponse({
				errors: [{ code: 'BILL-202' }],
				statusCode: HttpStatus.BAD_REQUEST,
				message: 'It was not possible to create user!',
			})
		}

		user = User.create({
			email: data.user.email,
			id: data.user.id,
			emailConfirmedAt: data.user.email_confirmed_at ? new Date(data.user.email_confirmed_at) : null,
			isSuperAdmin: false,
		})

		this.logger.log('user created on supabase')

		userProfile = UserProfile.create({
			name,
			surname,
			userId: data.user.id,
			birthDate: new Date(birthDate),
		})

		const savedUserProfile = await this.userRepository.saveProfile(userProfile)
		this.logger.debug('user profile created')
		user.profile = savedUserProfile

		this.logger.debug('execution completed')

		return buildResponse({
			statusCode: HttpStatus.CREATED,
			message: 'User created successfully!',
		})
	}
}
