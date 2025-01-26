import fastifyCookie from '@fastify/cookie'
import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory, Reflector } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { SupabaseGuard } from './infra/auth/guards/supabase.guard'
import { HttpExceptionFilter } from './infra/http/filters/http-exception.filter'
import { SupabaseService } from './shared/services/supabase.service'

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter())

	const config = app.get(ConfigService)
	const reflector = app.get(Reflector)
	const supabase = app.get(SupabaseService)

	await app.register(fastifyCookie)

	app.useGlobalGuards(new SupabaseGuard(reflector, supabase))

	app.useGlobalPipes(new ValidationPipe())

	app.useGlobalFilters(new HttpExceptionFilter())

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
