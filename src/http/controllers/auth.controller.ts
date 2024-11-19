import { Body, Controller, Logger, Post, Res } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { SigninUseCase } from 'src/application/use-cases/auth/signin'
import { Public } from '../decorators/public.decorator'
import { SignupDto } from '../dtos/auth/signup.dto'

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
	private readonly logger = new Logger(AuthController.name)

	constructor(private readonly signinUseCase: SigninUseCase) {}

	@Post('signup')
	@Public()
	async signup(@Body() body: SignupDto, @Res() response: Response) {
		this.logger.debug('Signup called')

		const { data, status } = await this.signinUseCase.execute(body)

		return response.status(status).json(data)
	}
}
