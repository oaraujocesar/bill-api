import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as cookieParser from 'cookie-parser'
import * as expressBasicAuth from 'express-basic-auth'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	const config = app.get(ConfigService)

	const swaggerPassword = config.getOrThrow('SWAGGER_PASSWORD')

	app.use(['/docs', '/docs-json'], expressBasicAuth({ challenge: true, users: { admin: swaggerPassword } }))

	const swagger = new DocumentBuilder()
		.setTitle('Bill API')
		.setDescription('The bill API description')
		.setVersion('0.1')
		.build()

	const documentFactory = () => SwaggerModule.createDocument(app, swagger)
	SwaggerModule.setup('docs', app, documentFactory)

	app.use(cookieParser())

	app.useGlobalPipes(new ValidationPipe())

	await app.listen(config.getOrThrow('PORT'))
}
bootstrap()
