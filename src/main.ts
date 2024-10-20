import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
      new ValidationPipe({
        //disableErrorMessages: true, // on production
        whitelist: true,
        transform: true
      }),
  );
    // Enable CORS
    app.enableCors();

    // Get port from environment variable or use default
    const port = process.env.PORT || 8000;
  await app.listen(port);
}
bootstrap();
