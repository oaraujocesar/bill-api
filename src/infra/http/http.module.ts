import { Module } from '@nestjs/common'
import { CreateAccountUseCase } from 'src/application/use-cases/account/create'
import { DeleteAccountUseCase } from 'src/application/use-cases/account/delete'
import { ListAccountsUseCase } from 'src/application/use-cases/account/list-all'
import { RefreshTokenUseCase } from 'src/application/use-cases/auth/refresh-token.use-case'
import { SigninUseCase } from 'src/application/use-cases/auth/signin'
import { SignupUseCase } from 'src/application/use-cases/auth/signup'
import { CreateCardUseCase } from 'src/application/use-cases/card/create.use-case'
import { ListCardsUseCase } from 'src/application/use-cases/card/list.use-case'
import { CreateCategoriesUseCase } from 'src/application/use-cases/category/create.use-case'
import { CreateFamilyMemberUseCase } from 'src/application/use-cases/family-member/create'
import { DeleteFamilyMemberUseCase } from 'src/application/use-cases/family-member/delete'
import { ListFamilyMembersUseCase } from 'src/application/use-cases/family-member/list'
import { CreateFamilyUseCase } from 'src/application/use-cases/family/create'
import { DeleteFamilyUseCase } from 'src/application/use-cases/family/delete'
import { ShowFamilyUseCase } from 'src/application/use-cases/family/show'
import { DatabaseModule } from 'src/infra/database/database.module'
import { SupabaseService } from 'src/shared/services/supabase.service'
import { AccountController } from './controllers/account.controller'
import { AuthController } from './controllers/auth.controller'
import { CardsController } from './controllers/cards.controller'
import { CategoriesController } from './controllers/categories.controller'
import { FamilyMemberController } from './controllers/family-member.controller'
import { FamilyController } from './controllers/family.controller'

@Module({
	imports: [DatabaseModule],
	controllers: [
		AuthController,
		CardsController,
		FamilyController,
		AccountController,
		CategoriesController,
		FamilyMemberController,
	],
	providers: [
		SigninUseCase,
		SignupUseCase,
		SupabaseService,
		ListCardsUseCase,
		CreateCardUseCase,
		ShowFamilyUseCase,
		ListAccountsUseCase,
		RefreshTokenUseCase,
		CreateFamilyUseCase,
		DeleteFamilyUseCase,
		DeleteAccountUseCase,
		CreateAccountUseCase,
		CreateCategoriesUseCase,
		ListFamilyMembersUseCase,
		CreateFamilyMemberUseCase,
		DeleteFamilyMemberUseCase,
	],
})
export class HttpModule {}
