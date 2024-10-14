import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { UserProfile } from 'src/application/entities/user-profile'
import { UserRepository } from 'src/application/repositories/user.repository'
import { ErrorResponse } from 'src/application/types/error-response'
import { SuccessResponse } from 'src/application/types/success-response'
import { USER_REPOSITORY } from 'src/shared/tokens'

type CreateUserRequest = {
	name: string
	surname: string
	birthDate: Date
}

type CreateUserResponse = SuccessResponse<UserProfile> | ErrorResponse

@Injectable()
export class CreateUserUseCase {
	constructor(@Inject(USER_REPOSITORY) private readonly userRepository: UserRepository) {}

	async execute({ name, surname, birthDate }: CreateUserRequest, userId: string): Promise<CreateUserResponse> {
		const user = await this.userRepository.findById(userId)

		if (!user) {
			return {
				data: {
					message: 'user not found',
				},
				status: HttpStatus.NOT_FOUND,
			}
		}

		const userProfile = await this.userRepository.saveProfile(
			UserProfile.create({
				name,
				surname,
				userId: user.id,
				birthDate,
			}),
		)

		return {
			data: userProfile,
			status: HttpStatus.CREATED,
		}
	}
}
