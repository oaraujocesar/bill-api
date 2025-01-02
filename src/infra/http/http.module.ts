import { Module } from '@nestjs/common'
import { CreateAccountUseCase } from 'src/application/use-cases/account/create'
import { DeleteAccountUseCase } from 'src/application/use-cases/account/delete'
import { ListAccountsUseCase } from 'src/application/use-cases/account/list-all'
import { SigninUseCase } from 'src/application/use-cases/auth/signin'
import { SignupUseCase } from 'src/application/use-cases/auth/signup'
import { DatabaseModule } from 'src/infra/database/database.module'
import { SupabaseService } from 'src/shared/services/supabase.service'
import { AccountController } from './controllers/account.controller'
import { AuthController } from './controllers/auth.controller'

@Module({
	imports: [DatabaseModule],
	controllers: [AuthController, AccountController],
	providers: [
		SigninUseCase,
		SignupUseCase,
		SupabaseService,
		CreateAccountUseCase,
		DeleteAccountUseCase,
		ListAccountsUseCase,
	],
})
export class HttpModule {}
