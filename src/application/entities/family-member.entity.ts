import { ApiProperty } from '@nestjs/swagger'
import { BaseEntity } from './helpers/base.entity'
import { ULID } from 'ulidx'

type FamilyMemberProps = {
  id?: number
  serial?: ULID
  familyId: number
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
  }

  static create(props: FamilyMemberProps) {
    return new FamilyMember(props)
  }
}
