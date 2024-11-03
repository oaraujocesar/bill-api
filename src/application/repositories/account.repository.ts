import { Account } from '../entities/account'

export interface AccountRepository {
	saveAccount(account: Account): Promise<Account>
}
