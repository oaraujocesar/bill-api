import { Response } from 'express'

import { Body, Controller, Logger, Post, Req, Res } from '@nestjs/common'
import { ApiCreatedResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { User } from 'src/application/entities/user'
import { CreateUserUseCase } from 'src/application/use-cases/user/create'
import { CreateUserDto } from '../dtos/create-user.dto'
import { RequestWithUser } from '../types/authenticated-request'

@ApiTags('Users')
@Controller('users')
export class UserController {
	private readonly logger = new Logger(UserController.name)

	constructor(private readonly createUserUseCase: CreateUserUseCase) {}

	@Post('/signup')
	@ApiOperation({ summary: 'Create an user' })
	@ApiCreatedResponse({ type: User })
	@ApiUnauthorizedResponse({
		description: 'User already exists',
		schema: { type: 'object', properties: { message: { type: 'string', example: 'username already taken' } } },
	})
	async createUser(@Res() response: Response, @Body() body: CreateUserDto, @Req() request: RequestWithUser) {
		this.logger.debug(`[Create User]: called with body ${JSON.stringify(body)}`)

		const { data, status } = await this.createUserUseCase.execute(body, request.user.id)

		return response.status(status).json(data)
	}
}
