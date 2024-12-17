import { Module } from '@nestjs/common'
import { CreateAccountUseCase } from 'src/application/use-cases/account/create'
import { DeleteAccountUseCase } from 'src/application/use-cases/account/delete'
import { SigninUseCase } from 'src/application/use-cases/auth/signin'
import { SignupUseCase } from 'src/application/use-cases/auth/signup'
import { CreateUserUseCase } from 'src/application/use-cases/user/create'
import { DatabaseModule } from 'src/infra/database/database.module'
import { SupabaseService } from 'src/shared/services/supabase.service'
import { AccountController } from './controllers/account.controller'
import { AuthController } from './controllers/auth.controller'
import { UserController } from './controllers/user.controller'

@Module({
	imports: [DatabaseModule],
	controllers: [AuthController, UserController, AccountController],
	providers: [
		SigninUseCase,
		SignupUseCase,
		SupabaseService,
		CreateUserUseCase,
		CreateAccountUseCase,
		DeleteAccountUseCase,
	],
})
export class HttpModule {}
