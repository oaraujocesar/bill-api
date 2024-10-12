import { UserProfile } from '../entities/user-profile'

export abstract class UserRepository {
	abstract saveProfile(userProfile: UserProfile): Promise<UserProfile>
}
