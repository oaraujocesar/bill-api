import { HttpStatus, Injectable } from '@nestjs/common'
import { UserProfile } from 'src/application/entities/user-profile'
import { UserRepository } from 'src/application/repositories/user.repository'
import { ErrorResponse } from 'src/application/types/error-response'
import { SuccessResponse } from 'src/application/types/success-response'

type CreateUserRequest = {
	name: string
	surname: string
	birthDate: Date
}

type CreateUserResponse = SuccessResponse<string> | ErrorResponse

@Injectable()
export class CreateUserUseCase {
	constructor(private readonly userRepository: UserRepository) {}

	async execute({ name, surname, birthDate }: CreateUserRequest, userId: string): Promise<CreateUserResponse> {
		const userProfile = await this.userRepository.saveProfile(
			UserProfile.create({
				name,
				surname,
				userId,
				birthDate,
			}),
		)

		return {
			data: 'user',
			status: HttpStatus.CREATED,
		}
	}
}
