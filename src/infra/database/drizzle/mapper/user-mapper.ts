import { User } from 'src/application/entities/user.entity'

type UserDrizzleResponse = {
	id: string
	email: string
	emailConfirmedAt: Date
	isSuperAdmin: boolean
}

export class UserMapper {
	static toDomain(user: UserDrizzleResponse): User {
		return User.create({
			id: user.id,
			email: user.email,
			emailConfirmedAt: user.emailConfirmedAt,
			isSuperAdmin: user.isSuperAdmin,
		})
	}
}
