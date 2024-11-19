import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common'
import { User } from 'src/application/entities/user'
import { UserProfile } from 'src/application/entities/user-profile'
import { UserRepository } from 'src/application/repositories/user.repository'
import { SupabaseService } from 'src/shared/services/supabase.service'
import { USER_REPOSITORY } from 'src/shared/tokens'
import { UseCaseResponse, buildResponse } from 'src/shared/utils/build-response'

type SignupRequest = {
	email: string
	password: string
	name: string
	surname: string
	birthDate: string
}

@Injectable()
export class SigninUseCase {
	private readonly logger = new Logger(SigninUseCase.name)

	constructor(
		private readonly supabase: SupabaseService,
		@Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
	) {}

	async execute({ email, password, name, surname, birthDate }: SignupRequest): Promise<UseCaseResponse<void>> {
		this.logger.debug('execution started')

		let user = await this.userRepository.findByEmail(email)

		let userProfile: UserProfile

		if (user) {
			this.logger.debug(`user ${email} already exists, verifying if exists profile`)

			userProfile = await this.userRepository.findProfileByUserId(user.id)

			if (userProfile) {
				this.logger.error(`user ${email} already exists and has a profile`)

				return buildResponse({
					isError: true,
					details: {
						code: 'BILL-201',
					},
					status: HttpStatus.BAD_REQUEST,
					message: 'It was not possible to create the user',
					data: null,
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
				isError: false,
				details: null,
				status: HttpStatus.CREATED,
				message: 'User created successfully',
				data: user,
			})
		}

		const { data, error } = await this.supabase.client.auth.signUp({
			email,
			password,
		})
		if (error) {
			this.logger.error(error)
			return buildResponse({
				isError: true,
				details: {
					code: 'BILL-202',
				},
				status: HttpStatus.BAD_REQUEST,
				message: 'It was not possible to create the user',
				data: null,
			})
		}

		user = User.create({
			email: data.user.email,
			id: data.user.id,
			emailConfirmedAt: data.user.email_confirmed_at ? new Date(data.user.email_confirmed_at) : null,
			isSuperAdmin: false,
		})

		this.logger.debug('user created on supabase')

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
			isError: false,
			details: null,
			status: HttpStatus.CREATED,
			message: 'User created successfully',
			data: user,
		})

		// const { data, error } = await this.supabase.client.auth.signUp({
		// 	email,
		// 	password,
		// })
		// if (error) {
		// 	this.logger.error(error)
		// 	return buildResponse({
		// 		isError: true,
		// 		details: {
		// 			code: 'BILL-201',
		// 		},
		// 		status: HttpStatus.BAD_REQUEST,
		// 		message: 'Error creating user on supabase',
		// 		data: null,
		// 	})
		// }

		// const userProfile = UserProfile.create({
		// 	name,
		// 	surname,
		// 	userId: data.user.id,
		// 	birthDate: new Date(birthDate),
		// })

		// await this.userRepository.saveProfile(userProfile)

		// this.logger.debug('user profile created')

		// this.logger.debug('execution completed')
	}
}
