import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { RedisStore } from 'connect-redis';
import * as session from 'express-session';
import * as passport from 'passport';
import { AppModule } from './app.module';
import { RedisService } from './shared/cache/redis.service';
import { RestExceptionFilter } from './shared/error/handler/rest.exception.handler';
import { HttpResponseInterceptor } from './shared/interceptors/http-response-interceptor';
import { swaggerConfig } from './shared/swagger/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const redisService = app.get(RedisService);
  const redisClient = redisService.getClient();

  app.setGlobalPrefix('api/v1');

  app.useGlobalInterceptors(new HttpResponseInterceptor());

  app.useGlobalFilters(new RestExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );
  app.enableCors({
    origin: [
      'http://bbrapi.inity.space:3000',
      'http://bbrapi.inity.space:3001',
      'https://bbrapi.inity.space:3000',
      'https://bbrapi.inity.space:3001',
      'https://bbr.test:3001',
      'https://bbr.test:3000',
      'http://bbr.test:3001',
      'http://bbr.test:3000',
      'https://bbr.test:3001',
      'https://bbr.test:3000',
      'https://bbr-admin.vercel.app',
    ],
    credentials: true,
  });

  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      name: process.env.SESSION_NAME || 'my-api-session',
      secret: process.env.SESSION_SECRET || 'supersecretkey',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        httpOnly: true,
        sameSite: false,
        maxAge: 24 * 60 * 60 * 1000, // 24h session expiration
      },
    })
  );

  // ✅ Initialize Passport.js
  app.use(passport.initialize());
  app.use(passport.session());

  // Set up Swagger using the imported configuration
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
}
bootstrap();
