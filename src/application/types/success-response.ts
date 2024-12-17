import { HttpStatus } from '@nestjs/common'

export type SuccessResponse<Entity> = {
	data?: Entity
	status: HttpStatus
}
