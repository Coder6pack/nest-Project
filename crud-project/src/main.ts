import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common'
import { LoggingInterceptor } from './shared/interceptor/logging.interceptor'
import { TransformInterceptor } from './shared/interceptor/transform.interceptor'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true, // trả về lỗi nếu có thêm trường không cần thiết
			transform: true, // tự động chuyển đổi kiểu dữ liệu của các trường
			forbidNonWhitelisted: true, // nếu có field không được khai báo decorator trong DTO mà client truyền lên thì sẽ báo lỗi,
			transformOptions: {
				//enableImplicitConversion: true, // chuyển đổi kiểu dữ liệu ngầm định như khai báo trong DTO
			},
			exceptionFactory(validationErrors) {
				console.log(validationErrors)
				throw new UnprocessableEntityException(
					validationErrors.map((error) => {
						return {
							fields: error.property,
							errors: Object.values(error.constraints as any).join(', '),
						}
					}),
				)
			},
		}),
	)
	app.useGlobalInterceptors(new LoggingInterceptor())
	app.useGlobalInterceptors(new TransformInterceptor())
	await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
