import { HttpStatus } from '@nestjs/common'

type BuildResponse<T> = {
	data: T
	status: HttpStatus
	isError: boolean
	message: string
	details?: Record<string, string>
}

type BuildResponseWithError<T> = BuildResponse<T> & {
	details: Record<string, string>
}

export type UseCaseResponse<T> = {
	data: { data: T; message: string } | { details: Record<string, string> }
	status: HttpStatus
}

export const buildResponse = ({
	data,
	status,
	isError,
	details,
	message,
}: BuildResponseWithError<typeof data> | BuildResponse<typeof data>): UseCaseResponse<typeof data> => {
	if (isError) {
		return {
			data: {
				message,
				details,
			},
			status,
		}
	}

	return {
		data: {
			data,
			message,
		},
		status,
	}
}
