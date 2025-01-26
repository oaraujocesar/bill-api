import { Family } from 'src/application/entities/family.entity'

export class FamilyViewModel {
	static toHTTP(family: Family) {
		return family
			? {
					serial: family.serial,
					name: family.name,
					createdAt: family.createdAt,
					updatedAt: family.updatedAt,
				}
			: undefined
	}
}
