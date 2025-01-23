import { faker } from '@faker-js/faker'
import { User } from './user.entity'

describe('User entity', () => {
	it('should create user', () => {
		const input = {
			id: faker.string.uuid(),
			email: faker.internet.email(),
			emailConfirmedAt: faker.date.past(),
			isSuperAdmin: faker.datatype.boolean(),
		}

		const user = User.create(input)

		expect(user).toEqual(expect.objectContaining(input))
	})
})
