import { ApiProperty } from '@nestjs/swagger'
import { ULID } from 'ulidx'
import { BaseEntity } from './helpers/base.entity'

type FamilyMemberProps = {
	id?: number
	serial?: ULID
	familyId: number
	isOwner?: boolean
	userId: string
	createdAt?: Date
	updatedAt?: Date
	deletedAt?: Date
}

export class FamilyMember extends BaseEntity {
	@ApiProperty()
	userId: string

	@ApiProperty()
	familyId: number

	@ApiProperty()
	isOwner: boolean

	constructor(props: FamilyMemberProps) {
		super({
			id: props.id,
			serial: props.serial,
			createdAt: props.createdAt,
			updatedAt: props.updatedAt,
			deletedAt: props.deletedAt,
		})

		this.familyId = props.familyId
		this.userId = props.userId
		this.isOwner = props.isOwner
	}

	static create(props: FamilyMemberProps) {
		return new FamilyMember(props)
	}
}
