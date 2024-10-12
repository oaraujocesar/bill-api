import { Inject, Injectable } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { User } from 'src/application/entities/user'
import { UserRepository } from 'src/application/repositories/user.repository'
import { DRIZZLE } from '../drizzle.module'
import * as schema from '../schema'

@Injectable()
export class UserDrizzleRepository implements UserRepository {
	constructor(@Inject(DRIZZLE) private readonly database: NodePgDatabase<typeof schema>) {}

	async getUserByEmail(email: string): Promise<User | null> {
		const user = await this.database.query.user.findFirst({
			where: eq(schema.user.email, email),
		})

		return User.create({
			id: 'user.id',
			email: user.email,
			name: user.name,
			surname: user.surname,
		})
	}
	save(user: User): Promise<User> {
		throw new Error('Method not implemented.')
	}
}
