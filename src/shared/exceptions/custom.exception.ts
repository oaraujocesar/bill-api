import { HttpException, HttpStatus, Logger } from '@nestjs/common'

type ExceptionProps = {
	message: string
	statusCode: HttpStatus
	error?: Error
	errors?: Record<string, string>[]
}

export class Exception extends HttpException {
	private readonly logger = new Logger(Exception.name)

	constructor({ message, statusCode, errors, error }: ExceptionProps) {
		super(message, statusCode, { cause: errors })

		if (error) {
			this.logger.error(error.stack)
		} else {
			this.logger.error(this.stack)
		}
	}
}
