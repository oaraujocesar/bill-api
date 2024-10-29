import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common'
import { UserProfile } from 'src/application/entities/user-profile'
import { UserRepository } from 'src/application/repositories/user.repository'
import { ErrorResponse } from 'src/application/types/error-response'
import { SuccessResponse } from 'src/application/types/success-response'
import { USER_REPOSITORY } from 'src/shared/tokens'

type CreateUserRequest = {
	name: string
	surname: string
	birthDate: string
}

type CreateUserResponse = SuccessResponse<UserProfile> | ErrorResponse

@Injectable()
export class CreateUserUseCase {
	private readonly logger = new Logger(CreateUserUseCase.name)

	constructor(@Inject(USER_REPOSITORY) private readonly userRepository: UserRepository) {}

	async execute({ name, surname, birthDate }: CreateUserRequest, userId: string): Promise<CreateUserResponse> {
		this.logger.debug('execution started')

		const user = await this.userRepository.findById(userId)

		if (!user) {
			this.logger.debug('user not found')

			return {
				data: {
					message: 'user not found',
				},
				status: HttpStatus.NOT_FOUND,
			}
		}

		let userProfile = await this.userRepository.findProfileByUserId(userId)

		if (userProfile) {
			this.logger.debug('user profile already exists')

			return {
				data: {
					message: 'user profile already exists',
				},
				status: HttpStatus.CONFLICT,
			}
		}

		userProfile = await this.userRepository.saveProfile(
			UserProfile.create({
				name,
				surname,
				userId: user.id,
				birthDate: new Date(birthDate),
			}),
		)

		this.logger.debug('execution finished successfully')

		return {
			data: userProfile,
			status: HttpStatus.CREATED,
		}
	}
}
