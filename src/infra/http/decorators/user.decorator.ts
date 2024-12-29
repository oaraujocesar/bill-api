import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { UserAuthenticated } from '../types/authenticated-request'

export const User = createParamDecorator((_data: unknown, ctx: ExecutionContext): UserAuthenticated => {
	const request = ctx.switchToHttp().getRequest()
	return request.user
})
