import { ResponseBody } from 'src/shared/utils/build-response'

export interface BaseUseCase {
	execute(prop: unknown): Promise<ResponseBody<unknown>>
}
