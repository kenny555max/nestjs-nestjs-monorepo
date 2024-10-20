import {Logger, Module} from '@nestjs/common';
import { MailserviceController } from './mailservice.controller';
import {MailService} from "./mailservice.service";

@Module({
  controllers: [MailserviceController],
  providers: [MailService,Logger],
})
export class MailserviceModule {}
