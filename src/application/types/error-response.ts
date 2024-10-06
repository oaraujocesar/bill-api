import { HttpStatus } from '@nestjs/common'

export type ErrorResponse = {
	data: {
		message: string
		details?: Record<string, string>
	}
	status: HttpStatus
}
