import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'
import { Response } from 'express'
import { buildResponse } from 'src/shared/utils/build-response'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const response = ctx.getResponse<Response>()
		const status = exception.getStatus()

		if (status === HttpStatus.BAD_REQUEST) {
			const exceptionResponse = exception.getResponse() as { message: string[] }

			return response.status(status).json(
				buildResponse({
					message: 'Validation failed',
					statusCode: status,
					errors: exceptionResponse.message,
				}),
			)
		}

		response.status(status).json(
			buildResponse({
				message: exception.message,
				statusCode: status,
				errors: exception.cause as Record<string, string>[],
			}),
		)
	}
}
