import { User } from '../entities/user'

export abstract class UserRepository {
	abstract getUserByEmail(email: string): Promise<User | null>
	abstract save(user: User): Promise<User>
}
