import { Account } from 'src/application/entities/account.entity'

export class AccountViewModel {
	static toHTTP(account: Account) {
		return {
			serial: account.serial,
			name: account.name,
			balance: account.balance,
			created_at: account.createdAt,
			updated_at: account.updatedAt,
		}
	}
}
