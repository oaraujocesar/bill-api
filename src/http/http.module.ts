import { Module } from '@nestjs/common'
import { CreateAccountUseCase } from 'src/application/use-cases/account/create'
import { DeleteAccountUseCase } from 'src/application/use-cases/account/delete'
import { CreateUserUseCase } from 'src/application/use-cases/user/create'
import { DatabaseModule } from 'src/infra/database/database.module'
import { AccountController } from './controllers/account.controller'
import { UserController } from './controllers/user.controller'

@Module({
	imports: [DatabaseModule],
	controllers: [UserController, AccountController],
	providers: [CreateUserUseCase, CreateAccountUseCase, DeleteAccountUseCase],
})
export class HttpModule {}
