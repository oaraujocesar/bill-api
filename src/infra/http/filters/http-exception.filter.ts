import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'
import { FastifyReply } from 'fastify'
import { buildResponse } from 'src/shared/utils/build-response'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const response = ctx.getResponse<FastifyReply>()
		const status = exception.getStatus()

		if (status === HttpStatus.BAD_REQUEST) {
			const exceptionResponse = exception.getResponse() as { message: string[] } | string
			let message: string
			let errors: string[]
			if (typeof exceptionResponse === 'object') {
				message = 'Validation failed.'
				errors = exceptionResponse.message
			} else if (typeof exceptionResponse === 'string') {
				message = exceptionResponse as string
				errors = []
			}

			return response.status(status).send(
				buildResponse({
					message,
					statusCode: status,
					errors,
				}),
			)
		}

		response.status(status).send(
			buildResponse({
				message: exception.message,
				statusCode: status,
				errors: exception.cause as Record<string, string>[],
			}),
		)
	}
}
