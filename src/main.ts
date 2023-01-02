import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initBot } from './bot'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000, async () => {
    initBot()
  });
}
bootstrap();
