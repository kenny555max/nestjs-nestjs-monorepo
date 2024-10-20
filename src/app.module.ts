import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MailserviceModule } from './mailservice/mailservice.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
      AuthModule,
    UserModule,
    MailserviceModule,
    ConfigModule.forRoot({
      isGlobal: true, // Makes the config available throughout the application
      envFilePath: '.env', // Specify the path to your .env file
    })
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
