import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';
// import { setupApp } from './setup-app';
// const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // setupApp(app);

  //* Moved cookieSession inside app module for resolving e2e test
  // app.use(
  //   cookieSession({
  //     keys: ['asdf'],
  //   }),
  // );

  //* Moved globalPipe inside app module for resolving e2e test
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //   }),
  // );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
