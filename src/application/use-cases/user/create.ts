import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { User } from 'src/application/entities/user'
import { UserRepository } from 'src/application/repositories/user.repository'
import { ErrorResponse } from 'src/application/types/error-response'
import { SuccessResponse } from 'src/application/types/success-response'

type CreateUserRequest = {
	name: string
	surname: string
	email: string
}

type CreateUserResponse = SuccessResponse<User> | ErrorResponse

@Injectable()
export class CreateUserUseCase {
	constructor(private readonly userRepository: UserRepository) {}

	async execute({ name, surname, email }: CreateUserRequest): Promise<CreateUserResponse> {
		let user = await this.userRepository.getUserByEmail(email)
		if (user) {
			return {
				status: HttpStatus.INTERNAL_SERVER_ERROR,
				data: { message: 'BL01' },
			}
		}

		user = User.create({
			name,
			surname,
			email,
		})

		user = await this.userRepository.save(user)

		return {
			data: user,
			status: HttpStatus.CREATED,
		}
	}
}
