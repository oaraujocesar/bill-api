import { Body, Controller, HttpStatus, Logger, Post, Res } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { FastifyReply } from 'fastify'
import { RefreshTokenUseCase } from 'src/application/use-cases/auth/refresh-token.use-case'
import { SigninUseCase } from 'src/application/use-cases/auth/signin'
import { SignupUseCase } from 'src/application/use-cases/auth/signup'
import { SigninDoc } from '../decorators/doc/auth/signin-headers.doc'
import { SignupDoc } from '../decorators/doc/auth/signup-headers.doc'
import { Public } from '../decorators/public.decorator'
import { RefreshTokenDto } from '../dtos/auth/refresh-token.dto'
import { SigninDto } from '../dtos/auth/signin.dto'
import { SignupDto } from '../dtos/auth/signup.dto'

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
	private readonly logger = new Logger(AuthController.name)

	constructor(
		private readonly signupUseCase: SignupUseCase,
		private readonly signinUseCase: SigninUseCase,
		private readonly refreshTokenUseCase: RefreshTokenUseCase,
	) {}

	@Post('refresh-token')
	@ApiBearerAuth()
	async refreshToken(@Body() body: RefreshTokenDto, @Res() response: FastifyReply) {
		this.logger.debug('Refresh token called')
		const { statusCode, data, message } = await this.refreshTokenUseCase.execute({ refreshToken: body.refresh_token })

		return response
			.status(statusCode)
			.setCookie('billio-refresh-token', data.refresh_token, {
				httpOnly: false,
				secure: false,
				expires: new Date(data.expires_in),
			})
			.setCookie('bill-auth-token', data.access_token, {
				httpOnly: true,
				secure: true,
				expires: new Date(data.expires_in),
			})
			.send({ data, message })
	}

	@Post('signin')
	@SigninDoc()
	@Public()
	async signin(@Res() response: FastifyReply, @Body() body: SigninDto) {
		this.logger.debug('Signin called')

		const { data, statusCode, message } = await this.signinUseCase.execute(body)

		if (statusCode === HttpStatus.BAD_REQUEST) {
			return response.status(statusCode).send({ data, message })
		}

		return response
			.status(statusCode)
			.setCookie('billio-refresh-token', data.refresh_token, {
				httpOnly: false,
				secure: false,
				expires: new Date(data.expires_in),
			})
			.setCookie('bill-auth-token', data.access_token, {
				httpOnly: true,
				secure: true,
				expires: new Date(data.expires_in),
			})
			.send({ data, message })
	}

	@Post('signup')
	@SignupDoc()
	@Public()
	async signup(@Body() body: SignupDto, @Res() response: FastifyReply) {
		this.logger.debug('Signup called')

		const { data, statusCode, message } = await this.signupUseCase.execute({ birthDate: body.birth_date, ...body })

		return response.status(statusCode).send({ data, message })
	}
}
