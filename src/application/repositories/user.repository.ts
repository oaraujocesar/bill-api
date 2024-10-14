import { User } from '../entities/user'
import { UserProfile } from '../entities/user-profile'

export interface UserRepository {
	saveProfile(userProfile: UserProfile): Promise<UserProfile>
	findById(userId: string): Promise<User | null>
}
