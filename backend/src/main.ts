import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.enableCors({
  //   origin: [
  //     'http://localhost:8081',
  //     'http://katasonov.kpd.nomorepartiesco.ru',
  //     'https://katasonov.kpd.nomorepartiesco.ru',
  //   ],
  //   app.enableCors();
  //   methods: ['GET', 'POST', 'DELETE', 'PATCH'],
  //   credentials: true,
  // });
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
