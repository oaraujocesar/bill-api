import { Module } from '@nestjs/common'
import { CreateUserUseCase } from 'src/application/use-cases/user/create'
import { DatabaseModule } from 'src/infra/database/database.module'
import { UserController } from './controllers/user.controller'

@Module({
	imports: [DatabaseModule],
	controllers: [UserController],
	providers: [CreateUserUseCase],
})
export class HttpModule {}
