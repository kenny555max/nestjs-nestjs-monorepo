import {Logger, Module} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {UserService} from "../user/user.service";
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import {MailService} from "../mailservice/mailservice.service";

@Module({
  imports: [PassportModule],
  controllers: [AuthController],
  providers: [AuthService, UserService, LocalStrategy, MailService],
})
export class AuthModule {}
