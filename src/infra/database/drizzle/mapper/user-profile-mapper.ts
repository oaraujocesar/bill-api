import { UserProfile } from 'src/application/entities/user-profile'

type DrizzleResultType = {
	id: number
	serial: string
	name: string
	surname: string
	userId: string
	birthDate: string
	createdAt: Date
	updatedAt: Date
}

export class UserProfileMapper {
	static toDrizzle(userProfile: UserProfile) {
		return {
			serial: userProfile.serial,
			name: userProfile.name,
			surname: userProfile.surname,
			birthDate: userProfile.birthDate.toISOString(),
			userId: userProfile.userId,
		}
	}

	static toDomain(userProfile: DrizzleResultType) {
		return UserProfile.create({
			id: userProfile.id,
			serial: userProfile.serial,
			name: userProfile.name,
			surname: userProfile.surname,
			userId: userProfile.userId,
			birthDate: new Date(userProfile.birthDate),
			createdAt: userProfile.createdAt,
			updatedAt: userProfile.updatedAt,
		})
	}
}
