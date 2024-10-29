import { faker } from '@faker-js/faker'
import { isValid } from 'ulidx'
import { UserProfile } from './user-profile'

describe('UserProfile entity', () => {
	it('should create user profile', () => {
		const input = {
			id: faker.number.int(),
			serial: faker.string.uuid(),
			name: faker.person.firstName(),
			surname: faker.person.lastName(),
			userId: faker.string.uuid(),
			birthDate: faker.date.past(),
		}

		const userProfile = UserProfile.create(input)

		expect(userProfile).toEqual(expect.objectContaining(input))
	})

	it('should generate serial and timestamps', () => {
		const input = {
			name: faker.person.firstName(),
			surname: faker.person.lastName(),
			userId: faker.string.uuid(),
			birthDate: faker.date.past(),
		}

		const userProfile = UserProfile.create(input)

		expect(userProfile).toEqual(
			expect.objectContaining({
				...input,
				serial: expect.any(String),
				createdAt: expect.any(Date),
				updatedAt: expect.any(Date),
			}),
		)

		expect(isValid(userProfile.serial)).toBe(true)
	})
})
