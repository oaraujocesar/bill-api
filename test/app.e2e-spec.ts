import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql'
import { Client } from 'pg'
import { AppModule } from 'src/app.module'
import { SigninUseCase } from 'src/application/use-cases/auth/signin'
import request from 'supertest'

describe('AppController (e2e)', () => {
	let app: INestApplication
	jest.setTimeout(60000)
	let postgresContainer: StartedPostgreSqlContainer
	let postgresClient: Client

	beforeAll(async () => {
		postgresContainer = await new PostgreSqlContainer().start()
		postgresClient = new Client(postgresContainer.getConnectionUri())
	})

	afterAll(async () => {
		await postgresClient.end()
		await postgresContainer.stop()
	})

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
			providers: [SigninUseCase],
		}).compile()

		app = moduleFixture.createNestApplication()
		await app.init()
	})

	it('/ (GET)', () => {
		return request(app.getHttpServer()).post('/auth/signin').expect(201)
	})
})
