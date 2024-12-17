import { HttpStatus } from '@nestjs/common'

export type ResponseData<T> = T | undefined

export type ResponseErrors = Array<Record<string, string>> | undefined

export type ResponseBody<T> = {
	statusCode: HttpStatus
	message: string
	data: ResponseData<T>
	errors: ResponseErrors
}

export function buildResponse<T>(
	config: Omit<ResponseBody<T>, 'data' | 'errors'> & { data?: ResponseData<T>; errors?: ResponseErrors },
): ResponseBody<T> {
	return {
		...config,
		data: config.data,
		errors: config.errors,
	}
}
