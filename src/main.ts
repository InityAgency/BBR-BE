import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './shared/swagger/swagger.config';
import { RestExceptionFilter } from './shared/error/handler/rest.exception.handler';
import * as session from 'express-session';
import * as passport from 'passport';
import { RedisStore } from 'connect-redis';
import { RedisService } from './shared/cache/redis.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const redisService = app.get(RedisService);
  const redisClient = redisService.getClient();

  app.setGlobalPrefix('api/v1');

  app.useGlobalFilters(new RestExceptionFilter());

  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      name: process.env.SESSION_NAME || 'my-api-session',
      secret: process.env.SESSION_SECRET || 'supersecretkey',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production', // Set `true` for HTTPS
        httpOnly: true,
        sameSite: 'strict',
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
