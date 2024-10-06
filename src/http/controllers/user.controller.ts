import { Response } from 'express'

import { Body, Controller, Post, Res } from '@nestjs/common'
import { CreateUserUseCase } from 'src/application/use-cases/user/create'
import { ApiCreatedResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { CreateUserDto } from '../dtos/create-user.dto'
import { User } from 'src/application/entities/user'

@ApiTags('Users')
@Controller('users')
export class UserController {
	constructor(private readonly createUserUseCase: CreateUserUseCase) {}

	@Post('/signup')
	@ApiOperation({ summary: 'Create an user' })
	@ApiCreatedResponse({ type: User })
	@ApiUnauthorizedResponse({
		description: 'User already exists',
		schema: { type: 'object', properties: { message: { type: 'string', example: 'username already taken' } } },
	})
	async createUser(@Res() response: Response, @Body() body: CreateUserDto) {
		const { data, status } = await this.createUserUseCase.execute(body)

		return response.status(status).json(data)
	}
}
