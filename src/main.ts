import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory, Reflector } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import cookieParser from 'cookie-parser'
import expressBasicAuth from 'express-basic-auth'
import { AppModule } from './app.module'
import { SupabaseGuard } from './infra/auth/guards/supabase.guard'
import { SupabaseService } from './shared/services/supabase.service'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	const config = app.get(ConfigService)
	const reflector = app.get(Reflector)
	const supabase = app.get(SupabaseService)

	const swaggerPassword = config.getOrThrow('SWAGGER_PASSWORD')

	app.use(['/docs', '/docs-json'], expressBasicAuth({ challenge: true, users: { admin: swaggerPassword } }))
	app.use(cookieParser())

	app.useGlobalGuards(new SupabaseGuard(reflector, supabase))

	app.useGlobalPipes(new ValidationPipe())

	const swagger = new DocumentBuilder()
		.setTitle('Bill API')
		.setDescription('The bill API description')
		.setVersion('0.1')
		.addBearerAuth({
			type: 'http',
			scheme: 'bearer',
			bearerFormat: 'JWT',
		})
		.build()

	const documentFactory = () => SwaggerModule.createDocument(app, swagger)
	SwaggerModule.setup('docs', app, documentFactory)

	await app.listen(config.getOrThrow('PORT'), () => {
		Logger.log(`Localhost documentation: http://localhost:${config.getOrThrow('PORT')}/docs`, 'NestApplication')
	})
}
bootstrap()
