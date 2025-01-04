import { faker } from '@faker-js/faker/.'
import { isValid } from 'ulidx'
import { FamilyMember } from './family-member.entity'
import { } from 'drizzle-orm/mysql-core'

describe('Family Member entity', () => {
	it('should create a family member', () => {
		const input = {
			id: faker.number.int(),
			serial: faker.string.ulid(),
			familyId: faker.number.int(),
			userId: faker.string.ulid(),
			createdAt: faker.date.anytime(),
			updatedAt: faker.date.anytime(),
			deletedAt: null,
		}

		const family = FamilyMember.create(input)

		expect(family).toEqual(
			expect.objectContaining(input),
		)
	})

	it('should generate serial and timestamps', () => {
		const input = {
			serial: faker.string.ulid(),
			userId: faker.string.uuid(),
			familyId: faker.number.int(),
		}

		const familyMember = FamilyMember.create(input)

		expect(familyMember).toEqual(
			expect.objectContaining({
				...input,
				createdAt: expect.any(Date),
				updatedAt: expect.any(Date),
			}),
		)

		expect(isValid(familyMember.serial)).toBe(true)
	})
})
