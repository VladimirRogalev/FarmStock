import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import * as cookieParser from 'cookie-parser';
import * as process from 'node:process';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(cookieParser());
    app.enableCors({
        origin: `${process.env.CLIENT_URL}`,
        methods: 'GET,POST,PUT,DELETE',
        credentials: true,
        exposeHeaders: 'set-cookie'
    });
    await app.listen(process.env.PORT ?? 5000, '0.0.0.0');
}

bootstrap();
