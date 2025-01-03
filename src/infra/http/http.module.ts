import { Module } from '@nestjs/common'
import { CreateAccountUseCase } from 'src/application/use-cases/account/create'
import { DeleteAccountUseCase } from 'src/application/use-cases/account/delete'
import { ListAccountsUseCase } from 'src/application/use-cases/account/list-all'
import { RefreshTokenUseCase } from 'src/application/use-cases/auth/refresh-token.use-case'
import { SigninUseCase } from 'src/application/use-cases/auth/signin'
import { SignupUseCase } from 'src/application/use-cases/auth/signup'
import { CreateCardUseCase } from 'src/application/use-cases/card/create.use-case'
import { DatabaseModule } from 'src/infra/database/database.module'
import { SupabaseService } from 'src/shared/services/supabase.service'
import { AccountController } from './controllers/account.controller'
import { AuthController } from './controllers/auth.controller'
import { CardsController } from './controllers/cards.controller'

@Module({
	imports: [DatabaseModule],
	controllers: [AuthController, AccountController, CardsController],
	providers: [
		SigninUseCase,
		SignupUseCase,
		SupabaseService,
		CreateAccountUseCase,
		DeleteAccountUseCase,
		ListAccountsUseCase,
		CreateCardUseCase,
		RefreshTokenUseCase,
	],
})
export class HttpModule {}
