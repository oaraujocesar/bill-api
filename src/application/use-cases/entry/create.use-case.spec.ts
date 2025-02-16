import { TestBed } from '@automock/jest'
import { faker } from '@faker-js/faker/.'
import { HttpStatus } from '@nestjs/common'
import { Account } from 'src/application/entities/account.entity'
import { Category } from 'src/application/entities/category.entity'
import { Entry, EntryType } from 'src/application/entities/entry.entity'
import { AccountRepository } from 'src/application/repositories/account.repository'
import { CategoryRepository } from 'src/application/repositories/category.repository'
import { TransactionRepository } from 'src/application/repositories/transactions.repository'
import { ACCOUNT_REPOSITORY, CATEGORY_REPOSITORY, TRANSACTIONS_REPOSITORY } from 'src/shared/tokens'
import { CreateEntryUseCase } from './create.use-case'

jest.mock('@nestjs/common/services/logger.service')

describe('CreateEntryUseCase', () => {
	let useCase: CreateEntryUseCase
	let accountRepository: jest.Mocked<AccountRepository>
	let categoryRepository: jest.Mocked<CategoryRepository>
	let transactionRepository: jest.Mocked<TransactionRepository>

	beforeEach(() => {
		const { unit, unitRef } = TestBed.create(CreateEntryUseCase).compile()

		useCase = unit
		accountRepository = unitRef.get<AccountRepository>(ACCOUNT_REPOSITORY)
		categoryRepository = unitRef.get<CategoryRepository>(CATEGORY_REPOSITORY)
		transactionRepository = unitRef.get<TransactionRepository>(TRANSACTIONS_REPOSITORY)
	})

	it('should create an entry', async () => {
		const userId = faker.string.uuid()

		const category = Category.create({
			name: faker.lorem.word(),
			iconName: faker.lorem.word(),
			userId,
			id: faker.number.int(50),
		})

		const entry = Entry.create({
			amount: faker.number.float(1000),
			categoryId: category.id,
			description: faker.lorem.sentence(),
			title: faker.lorem.word(),
			type: faker.helpers.objectValue(EntryType),
			accountId: faker.number.int(50),
			id: faker.number.int(50),
			installments: faker.number.int(12),
			paidAt: new Date(),
			payday: new Date(),
		})

		const useCaseInputs = {
			accountSerial: faker.string.ulid(),
			title: entry.title,
			categoryId: entry.categoryId,
			amount: entry.amount,
			userId,
			entryType: entry.type,
			description: entry.description,
			installments: entry.installments,
			payday: entry.payday,
		}

		transactionRepository.createEntry.mockResolvedValue(entry)
		accountRepository.findBySerial.mockResolvedValue(
			Account.create({
				balance: 1000,
				id: entry.accountId,
				name: faker.company.name(),
				serial: useCaseInputs.accountSerial,
				userId,
			}),
		)
		categoryRepository.findById.mockResolvedValue(category)

		const { data, statusCode, message } = await useCase.execute(useCaseInputs)

		expect(data).toEqual(entry)
		expect(statusCode).toBe(HttpStatus.CREATED)
		expect(message).toBe(`${entry.type} created successfully`)
		expect(transactionRepository.createEntry).toHaveBeenCalledTimes(1)
		expect(accountRepository.findBySerial).toHaveBeenCalledTimes(1)
		expect(accountRepository.findBySerial).toHaveBeenCalledWith(useCaseInputs.accountSerial)
		expect(categoryRepository.findById).toHaveBeenCalledWith(useCaseInputs.categoryId)
		expect(categoryRepository.findById).toHaveBeenCalledTimes(1)
	})

	it('should throw if category does not exist', async () => {
		const userId = faker.string.uuid()

		const entry = Entry.create({
			amount: faker.number.float(1000),
			categoryId: faker.number.int(50),
			description: faker.lorem.sentence(),
			title: faker.lorem.word(),
			type: faker.helpers.objectValue(EntryType),
			accountId: faker.number.int(50),
			id: faker.number.int(50),
			installments: faker.number.int(12),
			paidAt: new Date(),
			payday: new Date(),
		})

		const useCaseInputs = {
			accountSerial: faker.string.ulid(),
			title: entry.title,
			categoryId: entry.categoryId,
			amount: entry.amount,
			userId,
			entryType: entry.type,
			description: entry.description,
			installments: entry.installments,
			payday: entry.payday,
		}

		transactionRepository.createEntry.mockResolvedValue(entry)
		accountRepository.findBySerial.mockResolvedValue(
			Account.create({
				balance: 1000,
				id: entry.accountId,
				name: faker.company.name(),
				serial: useCaseInputs.accountSerial,
				userId,
			}),
		)
		categoryRepository.findById.mockResolvedValue(null)

		await expect(useCase.execute(useCaseInputs)).rejects.toThrow('Category not found!')
		expect(transactionRepository.createEntry).not.toHaveBeenCalled()
		expect(accountRepository.findBySerial).toHaveBeenCalledTimes(1)
		expect(accountRepository.findBySerial).toHaveBeenCalledWith(useCaseInputs.accountSerial)
		expect(categoryRepository.findById).toHaveBeenCalledTimes(1)
		expect(categoryRepository.findById).toHaveBeenCalledWith(useCaseInputs.categoryId)
	})

	it('should throw if account does not exist', async () => {
		const userId = faker.string.uuid()

		const category = Category.create({
			name: faker.lorem.word(),
			iconName: faker.lorem.word(),
			userId,
			id: faker.number.int(50),
		})

		const entry = Entry.create({
			amount: faker.number.float(1000),
			categoryId: faker.number.int(50),
			description: faker.lorem.sentence(),
			title: faker.lorem.word(),
			type: faker.helpers.objectValue(EntryType),
			accountId: faker.number.int(50),
			id: faker.number.int(50),
			installments: faker.number.int(12),
			paidAt: new Date(),
			payday: new Date(),
		})

		const useCaseInputs = {
			accountSerial: faker.string.ulid(),
			title: entry.title,
			categoryId: entry.categoryId,
			amount: entry.amount,
			userId,
			entryType: entry.type,
			description: entry.description,
			installments: entry.installments,
			payday: entry.payday,
		}

		accountRepository.findBySerial.mockResolvedValue(null)
		categoryRepository.findById.mockResolvedValue(category)
		transactionRepository.createEntry.mockResolvedValue(entry)

		await expect(useCase.execute(useCaseInputs)).rejects.toThrow('Account not found!')
		expect(transactionRepository.createEntry).not.toHaveBeenCalled()
		expect(accountRepository.findBySerial).toHaveBeenCalledTimes(1)
		expect(accountRepository.findBySerial).toHaveBeenCalledWith(useCaseInputs.accountSerial)
		expect(categoryRepository.findById).not.toHaveBeenCalled()
	})
})
